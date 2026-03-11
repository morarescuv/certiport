-- Insert exam categories for the three main exams
INSERT INTO public.exam_categories (name, slug, description, icon, color) VALUES
  ('Database Systems', 'database', 'Database design, SQL, and management systems', 'Database', 'blue'),
  ('Programming', 'programming', 'Programming and software development', 'Code', 'purple'),
  ('Networking', 'networking', 'Computer networking fundamentals and protocols', 'Network', 'green')
ON CONFLICT (slug) DO NOTHING;

-- Delete all existing exams and questions first
DELETE FROM public.question_responses
WHERE question_id IN (
  SELECT q.id
  FROM public.questions q
  JOIN public.exams e ON e.id = q.exam_id
);

DELETE FROM public.quiz_attempts
WHERE exam_id IN (SELECT id FROM public.exams);

DELETE FROM public.questions
WHERE exam_id IN (SELECT id FROM public.exams);

DELETE FROM public.exams;

-- Insert the 3 main exams
INSERT INTO public.exams (category_id, name, slug, description, passing_score, time_limit_minutes, question_count, difficulty) 
SELECT 
  c.id,
  e.name,
  e.slug,
  e.description,
  e.passing_score,
  e.time_limit_minutes,
  e.question_count,
  e.difficulty
FROM (VALUES
  ('database', 'Database Fundamentals', 'database-fundamentals', 'SQL, database design, normalization, and management systems', 70, 60, 40, 'intermediate'),
  ('programming', 'Python Programming', 'python-programming', 'Python syntax, data structures, OOP, and application development', 70, 60, 40, 'intermediate'),
  ('networking', 'Networking Essentials', 'networking-essentials', 'Network protocols, TCP/IP, OSI model, and network security', 70, 60, 40, 'intermediate')
) AS e(cat_slug, name, slug, description, passing_score, time_limit_minutes, question_count, difficulty)
JOIN public.exam_categories c ON c.slug = e.cat_slug;

-- Insert Database questions
INSERT INTO public.questions (exam_id, question_text, question_type, options, correct_answer, explanation, difficulty, points)
SELECT 
  e.id,
  q.question_text,
  'multiple_choice',
  q.options::jsonb,
  q.correct_answer,
  q.explanation,
  q.difficulty,
  q.points
FROM public.exams e
CROSS JOIN (VALUES
  ('Which SQL keyword is used to retrieve data from a database?', '["SELECT", "GET", "FETCH", "RETRIEVE"]', 'SELECT', 'SELECT is the standard SQL command used to query and retrieve data from database tables.', 'easy', 10),
  ('What does ACID stand for in database transactions?', '["Atomicity, Consistency, Isolation, Durability", "Association, Consistency, Integrity, Data", "Atomicity, Completeness, Isolation, Durability", "Access, Control, Integration, Distribution"]', 'Atomicity, Consistency, Isolation, Durability', 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don''t interfere), Durability (persistent).', 'medium', 15),
  ('Which normal form eliminates transitive dependencies?', '["First Normal Form", "Second Normal Form", "Third Normal Form", "Boyce-Codd Normal Form"]', 'Third Normal Form', 'Third Normal Form (3NF) requires that all non-key attributes depend only on the primary key, eliminating transitive dependencies.', 'medium', 15),
  ('What is a primary key?', '["A key that unlocks the database", "A unique identifier for each record", "The first column in a table", "A foreign key reference"]', 'A unique identifier for each record', 'A primary key uniquely identifies each record in a table and cannot contain NULL values.', 'easy', 10),
  ('Which JOIN returns all records from the left table and matching records from the right?', '["INNER JOIN", "RIGHT JOIN", "LEFT JOIN", "FULL JOIN"]', 'LEFT JOIN', 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched records from the right, with NULLs for non-matching right records.', 'medium', 15),
  ('What does the SQL GROUP BY clause do?', '["Sorts the results", "Filters rows before grouping", "Groups rows with same values", "Joins multiple tables"]', 'Groups rows with same values', 'GROUP BY groups rows that have the same values in specified columns, typically used with aggregate functions like COUNT, SUM, AVG.', 'medium', 15),
  ('Which data type stores variable-length character strings?', '["CHAR", "VARCHAR", "TEXT", "STRING"]', 'VARCHAR', 'VARCHAR stores variable-length character strings. CHAR is fixed-length, while VARCHAR only uses space needed plus length bytes.', 'easy', 10),
  ('What is a foreign key?', '["A key from another country", "A field that links to another table''s primary key", "The main key of a table", "A unique index"]', 'A field that links to another table''s primary key', 'A foreign key establishes a relationship between two tables by referencing the primary key of another table.', 'medium', 15),
  ('Which SQL command is used to modify existing data?', '["MODIFY", "UPDATE", "CHANGE", "EDIT"]', 'UPDATE', 'UPDATE is the SQL command used to modify existing records in a table.', 'easy', 10),
  ('What is an index in a database?', '["A book''s table of contents", "A data structure that improves query speed", "A list of all tables", "A primary key constraint"]', 'A data structure that improves query speed', 'An index is a data structure that improves the speed of data retrieval operations on a database table at the cost of additional storage.', 'medium', 15),
  ('What does SQL stand for?', '["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"]', 'Structured Query Language', 'SQL stands for Structured Query Language, the standard language for relational database management systems.', 'easy', 10),
  ('Which constraint ensures no duplicate values in a column?', '["PRIMARY KEY", "UNIQUE", "NOT NULL", "FOREIGN KEY"]', 'UNIQUE', 'The UNIQUE constraint ensures all values in a column are different. PRIMARY KEY also enforces uniqueness but additionally disallows NULLs.', 'easy', 10),
  ('What is a database view?', '["A visual representation of data", "A virtual table based on a query", "A database diagram", "A backup copy"]', 'A virtual table based on a query', 'A view is a virtual table based on the result set of a SQL query. It contains rows and columns like a real table.', 'medium', 15),
  ('Which function returns the number of rows in a table?', '["SUM()", "AVG()", "COUNT()", "TOTAL()"]', 'COUNT()', 'COUNT() is an aggregate function that returns the number of rows that match a specified criterion.', 'easy', 10),
  ('What is database normalization?', '["Making data look normal", "Organizing data to reduce redundancy", "Converting to standard format", "Backing up data"]', 'Organizing data to reduce redundancy', 'Normalization is the process of organizing data to minimize redundancy and dependency by dividing large tables into smaller ones.', 'medium', 15)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'database-fundamentals';

-- Insert Python questions
INSERT INTO public.questions (exam_id, question_text, question_type, options, correct_answer, explanation, difficulty, points)
SELECT 
  e.id,
  q.question_text,
  'multiple_choice',
  q.options::jsonb,
  q.correct_answer,
  q.explanation,
  q.difficulty,
  q.points
FROM public.exams e
CROSS JOIN (VALUES
  ('What is the correct way to create a list in Python?', '["list = ()", "list = []", "list = {}", "list = <>"]', 'list = []', 'Square brackets [] are used to create lists in Python. Parentheses create tuples, braces create dictionaries.', 'easy', 10),
  ('Which function is used to get the length of a list?', '["size()", "length()", "len()", "count()"]', 'len()', 'The built-in len() function returns the number of items in an object like lists, strings, or dictionaries.', 'easy', 10),
  ('What does the __init__ method do in Python classes?', '["Initializes a new object", "Deletes an object", "Creates a copy", "Compares objects"]', 'Initializes a new object', '__init__ is the constructor method called automatically when a new instance of a class is created.', 'medium', 15),
  ('How do you define a function in Python?', '["function myFunc():", "def myFunc():", "define myFunc():", "func myFunc():"]', 'def myFunc():', 'The def keyword is used to define functions in Python, followed by the function name and parentheses.', 'easy', 10),
  ('What is the output of 5 // 2 in Python?', '["2.5", "2", "3", "2.0"]', '2', 'The // operator performs floor division, returning the largest integer less than or equal to the division result.', 'medium', 15),
  ('Which of these is a mutable data type in Python?', '["tuple", "str", "list", "int"]', 'list', 'Lists are mutable (can be modified after creation). Tuples, strings, and integers are immutable in Python.', 'medium', 15),
  ('What does the try-except block do?', '["Tries to optimize code", "Handles exceptions/errors", "Creates a loop", "Imports modules"]', 'Handles exceptions/errors', 'try-except is Python''s exception handling mechanism that catches and handles errors gracefully.', 'medium', 15),
  ('What is a Python decorator?', '["A design pattern", "A function that modifies another function", "A class attribute", "A module import"]', 'A function that modifies another function', 'A decorator is a function that takes another function as input, extends its behavior, and returns a modified function.', 'hard', 20),
  ('How do you open a file for reading in Python?', '["open(''file.txt'', ''r'')", "open(''file.txt'', ''w'')", "open(''file.txt'', ''a'')", "file(''file.txt'')"]', 'open(''file.txt'', ''r'')', 'The ''r'' mode opens a file for reading. ''w'' is for writing, ''a'' for appending.', 'easy', 10),
  ('What is list comprehension in Python?', '["A way to create lists concisely", "A list sorting method", "A list comparison", "A list concatenation"]', 'A way to create lists concisely', 'List comprehension provides a concise way to create lists based on existing lists or iterables.', 'medium', 15),
  ('What does the pass statement do?', '["Passes execution to next line", "Does nothing (placeholder)", "Returns a value", "Breaks a loop"]', 'Does nothing (placeholder)', 'pass is a null operation used as a placeholder where code is syntactically required but no action is needed.', 'easy', 10),
  ('Which method is used to add an item to the end of a list?', '["append()", "add()", "insert()", "push()"]', 'append()', 'The append() method adds a single item to the end of a list. insert() adds at a specific position.', 'easy', 10),
  ('What is the difference between == and is?', '["They are identical", "== compares values, is compares identity", "is compares values, == compares identity", "is is for strings only"]', '== compares values, is compares identity', '== checks if values are equal, while is checks if two references point to the same object in memory.', 'medium', 15),
  ('What does the if __name__ == "__main__": block do?', '["Defines the main function", "Checks if script is run directly", "Imports the main module", "Creates a main class"]', 'Checks if script is run directly', 'This idiom checks whether the script is being run directly (not imported) and executes the code block only in that case.', 'medium', 15),
  ('What is a lambda function?', '["A named function", "An anonymous inline function", "A recursive function", "A static method"]', 'An anonymous inline function', 'Lambda functions are small anonymous functions defined with the lambda keyword, useful for short operations.', 'medium', 15)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'python-programming';

-- Insert Networking questions
INSERT INTO public.questions (exam_id, question_text, question_type, options, correct_answer, explanation, difficulty, points)
SELECT 
  e.id,
  q.question_text,
  'multiple_choice',
  q.options::jsonb,
  q.correct_answer,
  q.explanation,
  q.difficulty,
  q.points
FROM public.exams e
CROSS JOIN (VALUES
  ('What does IP stand for in TCP/IP?', '["Internet Protocol", "Internal Protocol", "Internet Process", "Interconnection Protocol"]', 'Internet Protocol', 'IP stands for Internet Protocol, the principal communications protocol for relaying datagrams across network boundaries.', 'easy', 10),
  ('Which layer of the OSI model handles routing?', '["Data Link", "Network", "Transport", "Session"]', 'Network', 'Layer 3 (Network Layer) is responsible for packet routing, logical addressing, and path determination.', 'medium', 15),
  ('What is the default port for HTTP?', '["21", "80", "443", "25"]', '80', 'HTTP (Hypertext Transfer Protocol) uses port 80 by default. HTTPS uses port 443.', 'easy', 10),
  ('Which protocol is used to translate domain names to IP addresses?', '["HTTP", "FTP", "DNS", "DHCP"]', 'DNS', 'DNS (Domain Name System) translates human-readable domain names to machine-readable IP addresses.', 'easy', 10),
  ('What does DHCP stand for?', '["Dynamic Host Configuration Protocol", "Dynamic Host Connection Protocol", "Domain Host Control Protocol", "Data Host Communication Protocol"]', 'Dynamic Host Configuration Protocol', 'DHCP automatically assigns IP addresses and network configuration to devices on a network.', 'medium', 15),
  ('Which device operates at Layer 2 of the OSI model?', '["Router", "Switch", "Hub", "Firewall"]', 'Switch', 'Switches operate at the Data Link Layer (Layer 2), using MAC addresses to forward frames.', 'medium', 15),
  ('What is the purpose of a subnet mask?', '["To hide the network", "To identify network and host portions", "To encrypt data", "To route packets"]', 'To identify network and host portions', 'A subnet mask divides an IP address into network and host portions, determining which part identifies the network.', 'medium', 15),
  ('Which protocol guarantees delivery of data packets?', '["UDP", "TCP", "IP", "ICMP"]', 'TCP', 'TCP (Transmission Control Protocol) provides reliable, ordered, and error-checked delivery of data.', 'medium', 15),
  ('What is the maximum length of a MAC address?', '["32 bits", "48 bits", "64 bits", "128 bits"]', '48 bits', 'MAC addresses are 48 bits (6 bytes) long, typically displayed as six groups of two hexadecimal digits.', 'medium', 15),
  ('Which layer of the OSI model does HTTP operate at?', '["Layer 4", "Layer 5", "Layer 6", "Layer 7"]', 'Layer 7', 'HTTP operates at the Application Layer (Layer 7), the top layer of the OSI model.', 'medium', 15),
  ('What is NAT?', '["Network Address Translation", "Network Authentication Token", "Node Allocation Table", "Network Access Type"]', 'Network Address Translation', 'NAT translates private IP addresses to a public IP address for internet communication, conserving IPv4 addresses.', 'hard', 20),
  ('Which cable type is used for Gigabit Ethernet?', '["Cat 3", "Cat 5", "Cat 5e", "Cat 6"]', 'Cat 6', 'Cat 6 (Category 6) cable supports Gigabit Ethernet and higher bandwidths with less crosstalk.', 'medium', 15),
  ('What is the purpose of ARP?', '["To encrypt network traffic", "To map IP addresses to MAC addresses", "To assign IP addresses", "To route packets between networks"]', 'To map IP addresses to MAC addresses', 'ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses on a local network.', 'medium', 15),
  ('Which wireless encryption standard is most secure?', '["WEP", "WPA", "WPA2", "WPA3"]', 'WPA3', 'WPA3 is the latest and most secure Wi-Fi encryption standard, replacing WPA2 with enhanced security features.', 'medium', 15),
  ('What is a VLAN?', '["Virtual Local Area Network", "Variable Length Area Network", "Virtual Large Area Network", "Verified Local Access Node"]', 'Virtual Local Area Network', 'VLANs logically segment networks into isolated broadcast domains regardless of physical location.', 'medium', 15)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'networking-essentials';
