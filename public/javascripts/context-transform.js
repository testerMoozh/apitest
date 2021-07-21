var $context = document.getElementById('context');
var $doc = document.getElementById('doc');
var $output = document.getElementById('output');
(function () {
    function isPlainObject(obj) {
        return obj ? typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype : false;
    }

    const supportType = ['string', 'number', 'array', 'object', 'boolean', 'integer'];

    function getType(type) {
        if (!type) type = 'string';
        if (supportType.indexOf(type) !== -1) {
            return type;
        }
        return typeof type;
    }

    function isSchema(object) {
        if (supportType.indexOf(object.type) !== -1) {
            return true;
        }
        return false;
    }

    function handleSchema(json, schema) {
        Object.assign(schema, json);
        if (schema.type === 'object') {
            delete schema.properties;
            parse(json.properties, schema);
            
        }
        if (schema.type === 'array') {
            delete schema.items;
            schema.items = {};
            parse(json.items, schema.items)
        }

    }

    function handleArray(arr, schema) {
        schema.type = 'array';
        var props = schema.items = {};
        parse(arr[0], props)
    }

    function handleObject(json, schema) {
        if (isSchema(json)) {
            return handleSchema(json, schema)
        }
        schema.type = 'object';
        schema.required = [];
        var props = schema.properties = {};
        for (var key in json) {
            var item = json[key];
            var curSchema = props[key] = {};
            if (key[0] === '*') {
                delete props[key];
                key = key.substr(1);
                schema.required.push(key);
                curSchema = props[key] = {};

            }
            parse(item, curSchema)
        }
    }

    function parse(json, schema) {
        if (Array.isArray(json)) {
            handleArray(json, schema)
        } else if (isPlainObject(json)) {
            handleObject(json, schema)
        } else {
            schema.type = getType(json)
        }
    }

    function ejs(data) {
        var JsonSchema = {};
        parse(data, JsonSchema);
        return JsonSchema;
    }

    if (typeof module !== 'undefined' && typeof module === 'object' && module.exports !== 'undefined') {
        module.exports = ejs;
    }

    if (typeof window !== 'undefined' && typeof window === 'object') {
        window.easyJsonSchema = ejs;
    }

})()

// my idiosyncratic @context
var context = {
    "@vocab": "http://schema.org/",
    "first_name": "givenName",
    "last_name": "familyName",
    "alias": "alternateName",
    "job_title": "jobTitle",
    "city": "addressLocality",
    "country": "addressCountry",
    "email": "email"

};

//fetch the API
function showAPI() {
    var x = document.getElementById("fname").value;
    function fetchData() {
        fetch(x)
            .then(response => {
                return response.json();
            })
            .then(data => {
                present(doc, data.data);
                var result = easyJsonSchema(data.data);
                present(schema, result);
            });
    }
    fetchData();
    present($context, context);

}


var linkedin_context = {
    "first_name": "http://schema.org/givenName",
    "last_name": "http://schema.org/familyName",
    "email": "http://schema.org/email"
};


// takes the input document and re-contextualizes it by matching mapped meaning
function translateContext() {
    jsonld.compact(doc, context, {
        expandContext: linkedin_context
    },
        function (err, compacted) {
            present($output, compacted);
        });
}


    // this bit just renders pretty JSON textareas
    function present($ta, value) {
        var cm_options = {
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            mode: "application/ld+json",
            lineWrapping: true
        };
        $ta.value = JSON.stringify(value, null, 2);
        CodeMirror.fromTextArea($ta, cm_options);
    }
