import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure .env.local has:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY (recommended) or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const categories = [
  { name: 'Database Systems', slug: 'database', description: 'Database design, SQL, and management systems', icon: 'Database', color: 'blue' },
  { name: 'Programming', slug: 'programming', description: 'Programming and software development', icon: 'Code', color: 'purple' },
  { name: 'Networking', slug: 'networking', description: 'Computer networking fundamentals and protocols', icon: 'Network', color: 'green' }
]

const exams = [
  { cat_slug: 'database', name: 'Database Fundamentals', slug: 'database-fundamentals', description: 'SQL, database design, normalization, and management systems', passing_score: 70, time_limit_minutes: 60, question_count: 40, difficulty: 'intermediate' },
  { cat_slug: 'programming', name: 'Python Programming', slug: 'python-programming', description: 'Python syntax, data structures, OOP, and application development', passing_score: 70, time_limit_minutes: 60, question_count: 40, difficulty: 'intermediate' },
  { cat_slug: 'networking', name: 'Networking Essentials', slug: 'networking-essentials', description: 'Network protocols, TCP/IP, OSI model, and network security', passing_score: 70, time_limit_minutes: 60, question_count: 40, difficulty: 'intermediate' }
]

const databaseQuestions = [
  { question_text: 'Which SQL keyword is used to retrieve data from a database?', options: ['SELECT', 'GET', 'FETCH', 'RETRIEVE'], correct_answer: 'SELECT', explanation: 'SELECT is the standard SQL command used to query and retrieve data from database tables.', difficulty: 'easy', points: 10 },
  { question_text: 'What does ACID stand for in database transactions?', options: ['Atomicity, Consistency, Isolation, Durability', 'Association, Consistency, Integrity, Data', 'Atomicity, Completeness, Isolation, Durability', 'Access, Control, Integration, Distribution'], correct_answer: 'Atomicity, Consistency, Isolation, Durability', explanation: 'ACID properties ensure reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don\'t interfere), Durability (persistent).', difficulty: 'medium', points: 15 },
  { question_text: 'Which normal form eliminates transitive dependencies?', options: ['First Normal Form', 'Second Normal Form', 'Third Normal Form', 'Boyce-Codd Normal Form'], correct_answer: 'Third Normal Form', explanation: 'Third Normal Form (3NF) requires that all non-key attributes depend only on the primary key, eliminating transitive dependencies.', difficulty: 'medium', points: 15 },
  { question_text: 'What is a primary key?', options: ['A key that unlocks the database', 'A unique identifier for each record', 'The first column in a table', 'A foreign key reference'], correct_answer: 'A unique identifier for each record', explanation: 'A primary key uniquely identifies each record in a table and cannot contain NULL values.', difficulty: 'easy', points: 10 },
  { question_text: 'Which JOIN returns all records from the left table and matching records from the right?', options: ['INNER JOIN', 'RIGHT JOIN', 'LEFT JOIN', 'FULL JOIN'], correct_answer: 'LEFT JOIN', explanation: 'LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table and matched records from the right, with NULLs for non-matching right records.', difficulty: 'medium', points: 15 },
  { question_text: 'What does the SQL GROUP BY clause do?', options: ['Sorts the results', 'Filters rows before grouping', 'Groups rows with same values', 'Joins multiple tables'], correct_answer: 'Groups rows with same values', explanation: 'GROUP BY groups rows that have the same values in specified columns, typically used with aggregate functions like COUNT, SUM, AVG.', difficulty: 'medium', points: 15 },
  { question_text: 'Which data type stores variable-length character strings?', options: ['CHAR', 'VARCHAR', 'TEXT', 'STRING'], correct_answer: 'VARCHAR', explanation: 'VARCHAR stores variable-length character strings. CHAR is fixed-length, while VARCHAR only uses space needed plus length bytes.', difficulty: 'easy', points: 10 },
  { question_text: 'What is a foreign key?', options: ['A key from another country', 'A field that links to another table\'s primary key', 'The main key of a table', 'A unique index'], correct_answer: 'A field that links to another table\'s primary key', explanation: 'A foreign key establishes a relationship between two tables by referencing the primary key of another table.', difficulty: 'medium', points: 15 },
  { question_text: 'Which SQL command is used to modify existing data?', options: ['MODIFY', 'UPDATE', 'CHANGE', 'EDIT'], correct_answer: 'UPDATE', explanation: 'UPDATE is the SQL command used to modify existing records in a table.', difficulty: 'easy', points: 10 },
  { question_text: 'What is an index in a database?', options: ["A book's table of contents", 'A data structure that improves query speed', 'A list of all tables', 'A primary key constraint'], correct_answer: 'A data structure that improves query speed', explanation: 'An index is a data structure that improves the speed of data retrieval operations on a database table at the cost of additional storage.', difficulty: 'medium', points: 15 },
  { question_text: 'What does SQL stand for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'System Query Language'], correct_answer: 'Structured Query Language', explanation: 'SQL stands for Structured Query Language, the standard language for relational database management systems.', difficulty: 'easy', points: 10 },
  { question_text: 'Which constraint ensures no duplicate values in a column?', options: ['PRIMARY KEY', 'UNIQUE', 'NOT NULL', 'FOREIGN KEY'], correct_answer: 'UNIQUE', explanation: 'The UNIQUE constraint ensures all values in a column are different. PRIMARY KEY also enforces uniqueness but additionally disallows NULLs.', difficulty: 'easy', points: 10 },
  { question_text: 'What is a database view?', options: ['A visual representation of data', 'A virtual table based on a query', 'A database diagram', 'A backup copy'], correct_answer: 'A virtual table based on a query', explanation: 'A view is a virtual table based on the result set of a SQL query. It contains rows and columns like a real table.', difficulty: 'medium', points: 15 },
  { question_text: 'Which function returns the number of rows in a table?', options: ['SUM()', 'AVG()', 'COUNT()', 'TOTAL()'], correct_answer: 'COUNT()', explanation: 'COUNT() is an aggregate function that returns the number of rows that match a specified criterion.', difficulty: 'easy', points: 10 },
  { question_text: 'What is database normalization?', options: ['Making data look normal', 'Organizing data to reduce redundancy', 'Converting to standard format', 'Backing up data'], correct_answer: 'Organizing data to reduce redundancy', explanation: 'Normalization is the process of organizing data to minimize redundancy and dependency by dividing large tables into smaller ones.', difficulty: 'medium', points: 15 }
]

const pythonQuestions = [
  { question_text: 'What is the correct way to create a list in Python?', options: ['list = ()', 'list = []', 'list = {}', 'list = <>'], correct_answer: 'list = []', explanation: 'Square brackets [] are used to create lists in Python. Parentheses create tuples, braces create dictionaries.', difficulty: 'easy', points: 10 },
  { question_text: 'Which function is used to get the length of a list?', options: ['size()', 'length()', 'len()', 'count()'], correct_answer: 'len()', explanation: 'The built-in len() function returns the number of items in an object like lists, strings, or dictionaries.', difficulty: 'easy', points: 10 },
  { question_text: 'What does the __init__ method do in Python classes?', options: ['Initializes a new object', 'Deletes an object', 'Creates a copy', 'Compares objects'], correct_answer: 'Initializes a new object', explanation: '__init__ is the constructor method called automatically when a new instance of a class is created.', difficulty: 'medium', points: 15 },
  { question_text: 'How do you define a function in Python?', options: ['function myFunc():', 'def myFunc():', 'define myFunc():', 'func myFunc():'], correct_answer: 'def myFunc():', explanation: 'The def keyword is used to define functions in Python, followed by the function name and parentheses.', difficulty: 'easy', points: 10 },
  { question_text: 'What is the output of 5 // 2 in Python?', options: ['2.5', '2', '3', '2.0'], correct_answer: '2', explanation: 'The // operator performs floor division, returning the largest integer less than or equal to the division result.', difficulty: 'medium', points: 15 },
  { question_text: 'Which of these is a mutable data type in Python?', options: ['tuple', 'str', 'list', 'int'], correct_answer: 'list', explanation: 'Lists are mutable (can be modified after creation). Tuples, strings, and integers are immutable in Python.', difficulty: 'medium', points: 15 },
  { question_text: 'What does the try-except block do?', options: ['Tries to optimize code', 'Handles exceptions/errors', 'Creates a loop', 'Imports modules'], correct_answer: 'Handles exceptions/errors', explanation: 'try-except is Python\'s exception handling mechanism that catches and handles errors gracefully.', difficulty: 'medium', points: 15 },
  { question_text: 'What is a Python decorator?', options: ['A design pattern', 'A function that modifies another function', 'A class attribute', 'A module import'], correct_answer: 'A function that modifies another function', explanation: 'A decorator is a function that takes another function as input, extends its behavior, and returns a modified function.', difficulty: 'hard', points: 20 },
  { question_text: "How do you open a file for reading in Python?", options: ["open('file.txt', 'r')", "open('file.txt', 'w')", "open('file.txt', 'a')", "file('file.txt')"], correct_answer: "open('file.txt', 'r')", explanation: "The 'r' mode opens a file for reading. 'w' is for writing, 'a' for appending.", difficulty: 'easy', points: 10 },
  { question_text: 'What is list comprehension in Python?', options: ['A way to create lists concisely', 'A list sorting method', 'A list comparison', 'A list concatenation'], correct_answer: 'A way to create lists concisely', explanation: 'List comprehension provides a concise way to create lists based on existing lists or iterables.', difficulty: 'medium', points: 15 },
  { question_text: 'What does the pass statement do?', options: ['Passes execution to next line', 'Does nothing (placeholder)', 'Returns a value', 'Breaks a loop'], correct_answer: 'Does nothing (placeholder)', explanation: 'pass is a null operation used as a placeholder where code is syntactically required but no action is needed.', difficulty: 'easy', points: 10 },
  { question_text: 'Which method is used to add an item to the end of a list?', options: ['append()', 'add()', 'insert()', 'push()'], correct_answer: 'append()', explanation: 'The append() method adds a single item to the end of a list. insert() adds at a specific position.', difficulty: 'easy', points: 10 },
  { question_text: 'What is the difference between == and is?', options: ['They are identical', '== compares values, is compares identity', 'is compares values, == compares identity', 'is is for strings only'], correct_answer: '== compares values, is compares identity', explanation: '== checks if values are equal, while is checks if two references point to the same object in memory.', difficulty: 'medium', points: 15 },
  { question_text: 'What does the if __name__ == "__main__": block do?', options: ['Defines the main function', 'Checks if script is run directly', 'Imports the main module', 'Creates a main class'], correct_answer: 'Checks if script is run directly', explanation: 'This idiom checks whether the script is being run directly (not imported) and executes the code block only in that case.', difficulty: 'medium', points: 15 },
  { question_text: 'What is a lambda function?', options: ['A named function', 'An anonymous inline function', 'A recursive function', 'A static method'], correct_answer: 'An anonymous inline function', explanation: 'Lambda functions are small anonymous functions defined with the lambda keyword, useful for short operations.', difficulty: 'medium', points: 15 }
]

const networkingQuestions = [
  { question_text: 'What does IP stand for in TCP/IP?', options: ['Internet Protocol', 'Internal Protocol', 'Internet Process', 'Interconnection Protocol'], correct_answer: 'Internet Protocol', explanation: 'IP stands for Internet Protocol, the principal communications protocol for relaying datagrams across network boundaries.', difficulty: 'easy', points: 10 },
  { question_text: 'Which layer of the OSI model handles routing?', options: ['Data Link', 'Network', 'Transport', 'Session'], correct_answer: 'Network', explanation: 'Layer 3 (Network Layer) is responsible for packet routing, logical addressing, and path determination.', difficulty: 'medium', points: 15 },
  { question_text: 'What is the default port for HTTP?', options: ['21', '80', '443', '25'], correct_answer: '80', explanation: 'HTTP (Hypertext Transfer Protocol) uses port 80 by default. HTTPS uses port 443.', difficulty: 'easy', points: 10 },
  { question_text: 'Which protocol is used to translate domain names to IP addresses?', options: ['HTTP', 'FTP', 'DNS', 'DHCP'], correct_answer: 'DNS', explanation: 'DNS (Domain Name System) translates human-readable domain names to machine-readable IP addresses.', difficulty: 'easy', points: 10 },
  { question_text: 'What does DHCP stand for?', options: ['Dynamic Host Configuration Protocol', 'Dynamic Host Connection Protocol', 'Domain Host Control Protocol', 'Data Host Communication Protocol'], correct_answer: 'Dynamic Host Configuration Protocol', explanation: 'DHCP automatically assigns IP addresses and network configuration to devices on a network.', difficulty: 'medium', points: 15 },
  { question_text: 'Which device operates at Layer 2 of the OSI model?', options: ['Router', 'Switch', 'Hub', 'Firewall'], correct_answer: 'Switch', explanation: 'Switches operate at the Data Link Layer (Layer 2), using MAC addresses to forward frames.', difficulty: 'medium', points: 15 },
  { question_text: 'What is the purpose of a subnet mask?', options: ['To hide the network', 'To identify network and host portions', 'To encrypt data', 'To route packets'], correct_answer: 'To identify network and host portions', explanation: 'A subnet mask divides an IP address into network and host portions, determining which part identifies the network.', difficulty: 'medium', points: 15 },
  { question_text: 'Which protocol guarantees delivery of data packets?', options: ['UDP', 'TCP', 'IP', 'ICMP'], correct_answer: 'TCP', explanation: 'TCP (Transmission Control Protocol) provides reliable, ordered, and error-checked delivery of data.', difficulty: 'medium', points: 15 },
  { question_text: 'What is the maximum length of a MAC address?', options: ['32 bits', '48 bits', '64 bits', '128 bits'], correct_answer: '48 bits', explanation: 'MAC addresses are 48 bits (6 bytes) long, typically displayed as six groups of two hexadecimal digits.', difficulty: 'medium', points: 15 },
  { question_text: 'Which layer of the OSI model does HTTP operate at?', options: ['Layer 4', 'Layer 5', 'Layer 6', 'Layer 7'], correct_answer: 'Layer 7', explanation: 'HTTP operates at the Application Layer (Layer 7), the top layer of the OSI model.', difficulty: 'medium', points: 15 },
  { question_text: 'What is NAT?', options: ['Network Address Translation', 'Network Authentication Token', 'Node Allocation Table', 'Network Access Type'], correct_answer: 'Network Address Translation', explanation: 'NAT translates private IP addresses to a public IP address for internet communication, conserving IPv4 addresses.', difficulty: 'hard', points: 20 },
  { question_text: 'Which cable type is used for Gigabit Ethernet?', options: ['Cat 3', 'Cat 5', 'Cat 5e', 'Cat 6'], correct_answer: 'Cat 6', explanation: 'Cat 6 (Category 6) cable supports Gigabit Ethernet and higher bandwidths with less crosstalk.', difficulty: 'medium', points: 15 },
  { question_text: 'What is the purpose of ARP?', options: ['To encrypt network traffic', 'To map IP addresses to MAC addresses', 'To assign IP addresses', 'To route packets between networks'], correct_answer: 'To map IP addresses to MAC addresses', explanation: 'ARP (Address Resolution Protocol) resolves IP addresses to MAC addresses on a local network.', difficulty: 'medium', points: 15 },
  { question_text: 'Which wireless encryption standard is most secure?', options: ['WEP', 'WPA', 'WPA2', 'WPA3'], correct_answer: 'WPA3', explanation: 'WPA3 is the latest and most secure Wi-Fi encryption standard, replacing WPA2 with enhanced security features.', difficulty: 'medium', points: 15 },
  { question_text: 'What is a VLAN?', options: ['Virtual Local Area Network', 'Variable Length Area Network', 'Virtual Large Area Network', 'Verified Local Access Node'], correct_answer: 'Virtual Local Area Network', explanation: 'VLANs logically segment networks into isolated broadcast domains regardless of physical location.', difficulty: 'medium', points: 15 }
]

async function seedData() {
  console.log('🌱 Starting database seeding...\n')

  let hadErrors = false

  // Insert categories
  console.log('Inserting categories...')
  for (const cat of categories) {
    const { error } = await supabase
      .from('exam_categories')
      .upsert(cat, { onConflict: 'slug' })
    
    if (error) {
      console.error(`Error inserting category ${cat.name}:`, error.message)
      hadErrors = true
      if (error.message.toLowerCase().includes('row-level security')) {
        console.error('RLS blocked this insert. Use SUPABASE_SERVICE_ROLE_KEY for seeding, or run the SQL seed in the Supabase SQL editor.')
      }
    } else {
      console.log(`  ✓ ${cat.name}`)
    }
  }

  if (hadErrors) {
    console.error('\nSeeding aborted due to errors while inserting categories.')
    process.exit(1)
  }

  // Get category IDs
  const { data: categoryData, error: catError } = await supabase
    .from('exam_categories')
    .select('id, slug')
  
  if (catError || !categoryData) {
    console.error('Error fetching categories:', catError?.message)
    process.exit(1)
  }

  const categoryMap = new Map(categoryData.map(c => [c.slug, c.id]))

  // Insert exams
  console.log('\nInserting exams...')
  for (const exam of exams) {
    const categoryId = categoryMap.get(exam.cat_slug)
    if (!categoryId) {
      console.error(`Category not found: ${exam.cat_slug}`)
      hadErrors = true
      continue
    }

    const { error } = await supabase
      .from('exams')
      .upsert({
        category_id: categoryId,
        name: exam.name,
        slug: exam.slug,
        description: exam.description,
        passing_score: exam.passing_score,
        time_limit_minutes: exam.time_limit_minutes,
        question_count: exam.question_count,
        difficulty: exam.difficulty
      }, { onConflict: 'slug' })
    
    if (error) {
      console.error(`Error inserting exam ${exam.name}:`, error.message)
      hadErrors = true
      if (error.message.toLowerCase().includes('row-level security')) {
        console.error('RLS blocked this insert. Use SUPABASE_SERVICE_ROLE_KEY for seeding, or run the SQL seed in the Supabase SQL editor.')
      }
    } else {
      console.log(`  ✓ ${exam.name}`)
    }
  }

  if (hadErrors) {
    console.error('\nSeeding aborted due to errors while inserting exams.')
    process.exit(1)
  }

  // Get exam IDs
  const { data: examData, error: examError } = await supabase
    .from('exams')
    .select('id, slug')
  
  if (examError || !examData) {
    console.error('Error fetching exams:', examError?.message)
    process.exit(1)
  }

  const examMap = new Map(examData.map(e => [e.slug, e.id]))

  // Insert Database questions
  console.log('\nInserting Database questions...')
  const dbExamId = examMap.get('database-fundamentals')
  if (dbExamId) {
    for (const q of databaseQuestions) {
      const { error } = await supabase
        .from('questions')
        .upsert({
          exam_id: dbExamId,
          question_text: q.question_text,
          question_type: 'multiple_choice',
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          points: q.points
        })
      
      if (error) {
        console.error(`Error inserting question:`, error.message)
        hadErrors = true
      }
    }
    console.log(`  ✓ ${databaseQuestions.length} Database questions`)
  }

  // Insert Python questions
  console.log('\nInserting Python questions...')
  const pyExamId = examMap.get('python-programming')
  if (pyExamId) {
    for (const q of pythonQuestions) {
      const { error } = await supabase
        .from('questions')
        .upsert({
          exam_id: pyExamId,
          question_text: q.question_text,
          question_type: 'multiple_choice',
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          points: q.points
        })
      
      if (error) {
        console.error(`Error inserting question:`, error.message)
        hadErrors = true
      }
    }
    console.log(`  ✓ ${pythonQuestions.length} Python questions`)
  }

  // Insert Networking questions
  console.log('\nInserting Networking questions...')
  const netExamId = examMap.get('networking-essentials')
  if (netExamId) {
    for (const q of networkingQuestions) {
      const { error } = await supabase
        .from('questions')
        .upsert({
          exam_id: netExamId,
          question_text: q.question_text,
          question_type: 'multiple_choice',
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          points: q.points
        })
      
      if (error) {
        console.error(`Error inserting question:`, error.message)
        hadErrors = true
      }
    }
    console.log(`  ✓ ${networkingQuestions.length} Networking questions`)
  }

  if (hadErrors) {
    console.error('\nSeeding finished with errors. Your tables may be partially populated.')
    process.exit(1)
  }

  console.log('\n✅ Seeding complete!')
  console.log('\nSummary:')
  console.log(`  - ${categories.length} categories`)
  console.log(`  - ${exams.length} exams`)
  console.log(`  - ${databaseQuestions.length + pythonQuestions.length + networkingQuestions.length} total questions`)
}

seedData().catch(console.error)
