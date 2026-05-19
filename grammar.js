const PREC = {
  lambda: 1,
  or: 2,
  and: 3,
  equality: 4,
  compare: 5,
  add: 6,
  multiply: 7,
  exponent: 8,
  unary: 9,
  call: 10,
};

const commaSep = (rule) => optional(seq(rule, repeat(seq(",", rule)), optional(",")));

module.exports = grammar({
  name: "finitescript",

  extras: ($) => [
    /[\s\uFEFF\u2060\u200B]/,
    $.comment,
  ],

  word: ($) => $.identifier,

  conflicts: ($) => [
    [$.parameter, $._primary_expression],
  ],

  rules: {
    source_file: ($) => seq(
      optional($.header),
      repeat($.import_statement),
      repeat($._statement),
    ),

    header: ($) => seq(
      choice("finite", "interop"),
      field("version", choice($.string, $.number)),
      ";",
      repeat($.metadata_statement),
      optional($.attributes_block),
    ),

    metadata_statement: ($) => choice(
      seq("partStudio", $.string, ";"),
      seq("assembly", $.string, ";"),
      seq("seed", $.number, ";"),
      seq("apiVersion", $.string, ";"),
    ),

    import_statement: ($) => seq("import", field("module", $.identifier), ";"),

    _statement: ($) => choice(
      $.export_statement,
      $.let_statement,
      $.feature_statement,
      $.call_statement,
      $.function_statement,
      $.return_statement,
      $.throw_statement,
      $.predicate_statement,
      $.type_statement,
      $.assert_statement,
      $.define_feature_statement,
      $.enum_statement,
      $.for_statement,
      $.if_statement,
      $.assignment_statement,
      $.index_assignment_statement,
      $.expression_statement,
    ),

    export_statement: ($) => seq("export", choice(
      $.let_statement,
      $.function_statement,
      $.predicate_statement,
      $.type_statement,
      $.enum_statement,
    )),

    let_statement: ($) => seq("let", field("name", $.identifier), "=", field("value", $._expression), ";"),

    feature_statement: ($) => seq(
      optional("default"),
      field("kind", choice("feature", "sketch")),
      field("name", $.identifier),
      optional(field("display_name", $.string)),
      optional(seq("suppressed", "=", field("suppressed", $._expression))),
      "=",
      field("call", choice($.builtin_call, $.call_expression)),
      optional($.block),
      ";",
    ),

    call_statement: ($) => prec(1, seq($.builtin_call, ";")),

    function_statement: ($) => seq(
      "function",
      field("name", $.identifier),
      $.parameter_list,
      $.block,
    ),

    predicate_statement: ($) => seq(
      "predicate",
      field("name", $.identifier),
      $.parameter_list,
      $.block,
    ),

    type_statement: ($) => seq(
      "type",
      field("name", $.identifier),
      "typecheck",
      field("predicate", $.identifier),
      ";",
    ),

    return_statement: ($) => seq("return", optional($._expression), ";"),
    throw_statement: ($) => seq("throw", $._expression, ";"),

    assert_statement: ($) => seq(
      "assert",
      field("condition", $._expression),
      optional(seq(",", field("message", $.string))),
      ";",
    ),

    define_feature_statement: ($) => seq(
      "defineFeature",
      field("name", $.identifier),
      optional(field("display_name", $.string)),
      $.parameter_list,
      "{",
      optional($.annotation_block),
      repeat($._statement),
      "}",
      ";",
    ),

    enum_statement: ($) => seq(
      "enum",
      field("name", $.identifier),
      "{",
      commaSep($.enum_variant),
      "}",
      ";",
    ),

    enum_variant: ($) => $.identifier,

    for_statement: ($) => seq(
      "for",
      field("name", $.identifier),
      "in",
      field("iterable", $._expression),
      $.block,
    ),

    if_statement: ($) => prec.right(seq(
      "if",
      "(",
      field("condition", $._expression),
      ")",
      field("consequence", $.block),
      optional(seq("else", field("alternative", choice($.if_statement, $.block)))),
    )),

    assignment_statement: ($) => prec(1, seq(
      field("name", $.identifier),
      "=",
      field("value", $._expression),
      ";",
    )),

    index_assignment_statement: ($) => prec(1, seq(
      field("name", $.identifier),
      "[",
      field("index", $._expression),
      "]",
      "=",
      field("value", $._expression),
      ";",
    )),

    expression_statement: ($) => seq($._expression, ";"),

    block: ($) => seq("{", repeat($._statement), "}"),

    attributes_block: ($) => seq(
      "attributes",
      "{",
      repeat(seq(field("feature", choice($.identifier, $.string)), ":", field("attributes", $._expression), optional(","))),
      "}",
    ),

    annotation_block: ($) => seq(
      "annotation",
      "{",
      repeat($.annotation_field),
      "}",
    ),

    annotation_field: ($) => seq(
      field("key", choice($.property_identifier, $.string)),
      ":",
      field("value", $._expression),
      optional(","),
    ),

    parameter_list: ($) => seq(
      "(",
      commaSep(choice($.parameter, $.rest_parameter)),
      ")",
    ),

    parameter: ($) => $.identifier,
    rest_parameter: ($) => seq("...", field("name", $.identifier)),

    _expression: ($) => choice(
      $.lambda_expression,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.builtin_call,
      $.index_expression,
      $.member_expression,
      $._primary_expression,
    ),

    lambda_expression: ($) => prec.right(PREC.lambda, seq(
      $.parameter_list,
      "=>",
      $.block,
    )),

    binary_expression: ($) => choice(
      ...[
        ["||", PREC.or],
        ["&&", PREC.and],
        ["==", PREC.equality],
        ["!=", PREC.equality],
        ["<", PREC.compare],
        ["<=", PREC.compare],
        [">", PREC.compare],
        [">=", PREC.compare],
        ["is", PREC.compare],
        ["+", PREC.add],
        ["-", PREC.add],
        ["*", PREC.multiply],
        ["/", PREC.multiply],
        ["^", PREC.exponent],
      ].map(([operator, precedence]) =>
        prec.left(precedence, seq(
          field("left", $._expression),
          field("operator", operator),
          field("right", $._expression),
        )),
      ),
    ),

    unary_expression: ($) => prec(PREC.unary, seq(
      field("operator", choice("!", "-", "+")),
      field("argument", $._expression),
    )),

    call_expression: ($) => prec(PREC.call, seq(
      field("function", choice($.identifier, $.member_expression)),
      $.argument_list,
    )),

    builtin_call: ($) => prec(PREC.call, seq(
      "@",
      field("function", $.builtin_name),
      $.argument_list,
    )),

    builtin_name: ($) => $.identifier,

    argument_list: ($) => seq("(", commaSep($._expression), ")"),

    index_expression: ($) => prec(PREC.call, seq(
      field("target", $._expression),
      "[",
      field("index", $._expression),
      "]",
    )),

    member_expression: ($) => prec(PREC.call, seq(
      field("object", choice($.identifier, $.member_expression)),
      ".",
      field("property", $.identifier),
    )),

    _primary_expression: ($) => choice(
      $.number,
      $.string,
      $.boolean,
      $.null,
      $.this,
      $.identifier,
      $.array,
      $.object,
      $.function_expression,
      $.parenthesized_expression,
    ),

    function_expression: ($) => seq("function", $.parameter_list, $.block),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    array: ($) => seq("[", commaSep($._expression), "]"),

    object: ($) => seq("{", commaSep($.object_field), "}"),

    object_field: ($) => seq(
      field("key", choice($.property_identifier, $.string)),
      ":",
      field("value", $._expression),
    ),

    property_identifier: ($) => $.identifier,

    boolean: (_) => choice("true", "false"),
    null: (_) => "null",
    this: (_) => "this",

    identifier: (_) => /[A-Za-z_][A-Za-z0-9_]*/,
    number: (_) => /\d+(\.\d+)?([eE][+-]?\d+)?/,
    string: ($) => seq('"', repeat(choice($.escape_sequence, /[^"\\]/)), '"'),
    escape_sequence: (_) => token(seq("\\", /./)),
    comment: (_) => token(choice(
      seq("//", /[^\n]*/),
      seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/"),
    )),
  },
});
