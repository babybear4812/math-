# mathplusplus - a programming language interpreter
Building this interpreter requires 3 major steps: lexical analysis, parsing, and generation/evaluation

1) Lexical analysis is the splitting of codes into individual tokens. It comes from the Greek word lex which means “word”, and will split the code into either a character of length 1, or more if it is an identifier / multidigit number.

2) Parsing involves giving some sort of context to the lexical analysis. It’s almost like taking words and applying grammar rules so that we can compose larger statements and expressions. Roughly speaking, we do this by creating a parse tree which will then be evaluated in the following step.

3) Generation / Evaluation involves evaluating each individual node on the parse tree and returns the interpreted user input.

Although the code is fully commented using JSDoc, below is a summary of the three major steps and their relevant methods.
I will also add that the most common way of writing a parser is using Backus-Naur grammar. In an attempt to stray somewhat from the norm, I’ve attempted to write the parser using a technique called “operator-precedence parsing”, and have gained some inspiration from this article (http://crockford.com/javascript/tdop/tdop.html) by Douglas Crockford who was involved in the development of JS and the popularization of the JSON data format, and wrote “JavaScrtipt: The Good Parts”.


### **Lexer**
The lexer itself is a relatively small method that takes an input (the actual code) as a parameter. In the constructor itself we also declare an array which will hold our tokens.
The methods associated with the lexer are as follows:

-	isDigit() – checks if a given character is a digit
-	isOperator() – checks if a given character is an operator
-	isIdentifier() – checks if a given character is a string, but not whitespace
-	getNextChar() – a utility function that increments the global index and returns the next characters (useful when looping through a number/identifier that is multiple characters long)
-	addToken(type, value) – adds a token object with key-value pairs for type and value

### Parser
The parser is definitely the largest piece out of the three to understand and implement. The methods associated with the parser are as follows:

-	generateSymbol(id, leftBindingPower, nullDenotativeFunction, leftDenotativeFunction) – creates a symbol and adds it to a global object containing all symbols. The LBP is a measure of how strongly a symbol is bound to its lefthand side (e.g. division and multiplication have a higher LBP than do addition and subtraction). The NDF is used by variables, literals, and prefix operators (e.g. the negation sign in front of a number). The LDF is used primarily by infix operators (i.e. the ‘=’ sign which will fall in between two statements to form an expression.)
-	interpretToken(token) – returns a token object’s type and value properties
-	getInterpretedToken() – returns a token object from the `this.tokens` array at the current global index
-	generateExpressionTree(rightBindingPower) – generates the parse tree of the last expression to have been interpreted using its right binding power
-	infix(id, leftBindingPower, rightBindingPower, leftDenotativeFunction) – generates a symbol for an infix operator (i.e. any operator that goes between two numbers or identifiers)
-	prefix(id, rightBindingPower) – generates a symbol for a prefix operator (i.e. any operator that goes before a number, such as the negation symbol)

### Evalutaor:
Of the three steps, this one is the shortest to implement as it mainly involves calling on information that has been preprocessed by the lexer and parser.
-	getNodeVal(node) – a utility function that will be called when we loop through the entire parse tree; it returns information about the node deending on if it was of `type` number, operator, identifier, assign, call, or function.
-	calculate() – calls the lexer, parser, and then the evaluator. In essence, this executes the running of the entire interpreter
