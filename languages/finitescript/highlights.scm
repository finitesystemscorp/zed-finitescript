(comment) @comment

(string) @string
(escape_sequence) @string.escape
(number) @number

[
  "finite"
  "interop"
  "partStudio"
  "assembly"
  "seed"
  "apiVersion"
  "let"
  "import"
  "export"
  "feature"
  "sketch"
  "suppressed"
  "assert"
  "attributes"
  "default"
  "defineFeature"
  "annotation"
  "enum"
  "for"
  "in"
  "if"
  "else"
  "function"
  "return"
  "throw"
  "predicate"
  "type"
  "typecheck"
  "is"
] @keyword

((identifier) @keyword
  (#eq? @keyword "target"))

(boolean) @boolean
(null) @constant.builtin
(this) @variable.special

(builtin_call
  "@" @operator.special
  function: (builtin_name) @function.builtin)
(call_expression
  function: (identifier) @function)

(feature_statement
  name: (identifier) @function)
(define_feature_statement
  name: (identifier) @function)
(function_statement
  name: (identifier) @function)
(predicate_statement
  name: (identifier) @function)

(type_statement
  name: (identifier) @type)
(enum_statement
  name: (identifier) @enum)
(enum_variant) @variant
(member_expression
  object: (identifier) @type
  property: (identifier) @variant)

(object_field
  key: (property_identifier) @property)
(object_field
  key: (string) @property)
(annotation_field
  key: (property_identifier) @property)
(annotation_field
  key: (string) @property)

(parameter) @variable.parameter
(rest_parameter
  name: (identifier) @variable.parameter)

[
  "+"
  "-"
  "*"
  "/"
  "^"
  "!"
  "="
  "=>"
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "&&"
  "||"
] @operator

[
  "{"
  "}"
  "["
  "]"
  "("
  ")"
] @punctuation.bracket

[
  ","
  ":"
  ";"
  "."
  "..."
] @punctuation.delimiter
