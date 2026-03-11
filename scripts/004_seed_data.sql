-- Insert sample schools
INSERT INTO public.schools (name, code, city, country) VALUES
  ('Lincoln High School', 'LINCOLN-HS', 'Portland', 'USA'),
  ('Washington Academy', 'WASH-ACAD', 'Seattle', 'USA'),
  ('Jefferson Technical', 'JEFF-TECH', 'San Francisco', 'USA'),
  ('Roosevelt Prep', 'ROOSEVELT', 'Los Angeles', 'USA'),
  ('Kennedy STEM Academy', 'KENNEDY-STEM', 'Denver', 'USA'),
  ('Madison Digital Arts', 'MADISON-DA', 'Austin', 'USA'),
  ('Adams Business School', 'ADAMS-BIZ', 'Chicago', 'USA'),
  ('Monroe Tech Institute', 'MONROE-TECH', 'Boston', 'USA')
ON CONFLICT (code) DO NOTHING;

-- Insert exam categories
INSERT INTO public.exam_categories (name, slug, description, icon, color) VALUES
  ('Microsoft Office', 'microsoft-office', 'Microsoft Office Specialist certifications', 'FileSpreadsheet', 'blue'),
  ('Adobe Creative', 'adobe-creative', 'Adobe Certified Professional certifications', 'Palette', 'red'),
  ('IT Fundamentals', 'it-fundamentals', 'CompTIA IT Fundamentals+ certification', 'Monitor', 'green'),
  ('Programming', 'programming', 'Programming and development certifications', 'Code', 'purple')
ON CONFLICT (slug) DO NOTHING;

-- Insert exams
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
  ('microsoft-office', 'Microsoft Word Expert', 'ms-word-expert', 'Master document creation, formatting, and collaboration', 70, 50, 40, 'intermediate'),
  ('microsoft-office', 'Microsoft Excel Expert', 'ms-excel-expert', 'Advanced spreadsheets, formulas, and data analysis', 70, 50, 40, 'intermediate'),
  ('microsoft-office', 'Microsoft PowerPoint', 'ms-powerpoint', 'Professional presentations and visual communication', 70, 50, 35, 'beginner'),
  ('microsoft-office', 'Microsoft Access', 'ms-access', 'Database design and management fundamentals', 70, 50, 35, 'intermediate'),
  ('adobe-creative', 'Photoshop CC', 'adobe-photoshop', 'Image editing, compositing, and digital design', 63, 50, 45, 'intermediate'),
  ('adobe-creative', 'Illustrator CC', 'adobe-illustrator', 'Vector graphics and illustration design', 63, 50, 40, 'intermediate'),
  ('adobe-creative', 'Premiere Pro CC', 'adobe-premiere', 'Video editing and production workflows', 63, 50, 40, 'advanced'),
  ('it-fundamentals', 'IT Fundamentals+', 'comptia-itf', 'Basic IT concepts, infrastructure, and security', 65, 60, 75, 'beginner'),
  ('programming', 'Python Essentials', 'python-essentials', 'Python programming fundamentals and applications', 70, 45, 40, 'beginner')
) AS e(cat_slug, name, slug, description, passing_score, time_limit_minutes, question_count, difficulty)
JOIN public.exam_categories c ON c.slug = e.cat_slug
ON CONFLICT (slug) DO NOTHING;

-- Insert sample questions for Microsoft Excel
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
  ('What function would you use to find the average of a range of cells?', '["SUM", "AVERAGE", "COUNT", "MAX"]', 'AVERAGE', 'AVERAGE calculates the arithmetic mean of the values in a range.', 'easy', 10),
  ('Which keyboard shortcut opens the Find and Replace dialog?', '["Ctrl+F", "Ctrl+H", "Ctrl+R", "Ctrl+G"]', 'Ctrl+H', 'Ctrl+H opens Find and Replace, while Ctrl+F opens only Find.', 'easy', 10),
  ('What does the VLOOKUP function do?', '["Looks up values vertically", "Looks up values horizontally", "Validates data", "Creates a lookup table"]', 'Looks up values vertically', 'VLOOKUP searches for a value in the first column and returns a value in the same row from another column.', 'medium', 15),
  ('Which function counts cells that contain numbers?', '["COUNT", "COUNTA", "COUNTIF", "COUNTBLANK"]', 'COUNT', 'COUNT only counts cells containing numbers. COUNTA counts non-empty cells.', 'easy', 10),
  ('What is the result of =IF(10>5, "Yes", "No")?', '["Yes", "No", "TRUE", "10"]', 'Yes', 'Since 10 is greater than 5, the condition is TRUE, returning "Yes".', 'medium', 15),
  ('Which chart type is best for showing trends over time?', '["Pie chart", "Line chart", "Bar chart", "Scatter plot"]', 'Line chart', 'Line charts effectively display trends and changes over continuous time periods.', 'easy', 10),
  ('What does the $ symbol do in a cell reference like $A$1?', '["Makes it absolute", "Makes it relative", "Adds currency formatting", "Creates a hyperlink"]', 'Makes it absolute', 'The $ symbol creates an absolute reference that does not change when copied.', 'medium', 15),
  ('Which function joins text from multiple cells?', '["JOIN", "CONCAT", "MERGE", "COMBINE"]', 'CONCAT', 'CONCAT (or CONCATENATE) joins text strings from multiple cells together.', 'easy', 10),
  ('What is a PivotTable used for?', '["Data summarization", "Data entry", "Spell checking", "Printing"]', 'Data summarization', 'PivotTables summarize, analyze, explore, and present large amounts of data.', 'medium', 15),
  ('Which feature removes duplicate values from a range?', '["Filter", "Remove Duplicates", "Find and Replace", "Sort"]', 'Remove Duplicates', 'Remove Duplicates is found in the Data tab and eliminates duplicate rows.', 'easy', 10)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'ms-excel-expert';

-- Insert sample questions for Microsoft Word
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
  ('What is the keyboard shortcut to bold text?', '["Ctrl+B", "Ctrl+I", "Ctrl+U", "Ctrl+D"]', 'Ctrl+B', 'Ctrl+B applies bold formatting to selected text.', 'easy', 10),
  ('Which tab contains the Page Setup options?', '["Home", "Insert", "Layout", "View"]', 'Layout', 'The Layout tab contains margins, orientation, and other page setup options.', 'easy', 10),
  ('What feature allows you to see how a document will look when printed?', '["Print Preview", "Draft View", "Outline View", "Read Mode"]', 'Print Preview', 'Print Preview shows exactly how the document will appear when printed.', 'easy', 10),
  ('Which feature tracks changes made to a document?', '["Comments", "Track Changes", "Version History", "Compare"]', 'Track Changes', 'Track Changes records all edits made to a document for review.', 'medium', 15),
  ('What is a mail merge used for?', '["Creating personalized documents", "Merging email accounts", "Combining documents", "Sending emails"]', 'Creating personalized documents', 'Mail merge creates personalized letters, labels, or emails using a data source.', 'medium', 15),
  ('Which view is best for creating an outline of your document?', '["Print Layout", "Outline", "Draft", "Web Layout"]', 'Outline', 'Outline view helps organize document structure using headings and subheadings.', 'medium', 15),
  ('What does Ctrl+Z do?', '["Undo", "Redo", "Zoom", "Close"]', 'Undo', 'Ctrl+Z undoes the most recent action in Word.', 'easy', 10),
  ('Which feature allows you to create a table of contents automatically?', '["References tab", "Insert tab", "Home tab", "View tab"]', 'References tab', 'The References tab contains tools for creating tables of contents, citations, and indexes.', 'medium', 15),
  ('What is the purpose of styles in Word?', '["Consistent formatting", "Adding images", "Spell checking", "Page numbering"]', 'Consistent formatting', 'Styles ensure consistent formatting throughout a document and enable automatic TOC generation.', 'medium', 15),
  ('Which feature splits the document window into two panes?', '["Split", "New Window", "Arrange All", "Switch Windows"]', 'Split', 'Split divides the window to view different parts of the same document.', 'easy', 10)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'ms-word-expert';

-- Insert sample questions for Adobe Photoshop
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
  ('What is the shortcut to duplicate a layer?', '["Ctrl+J", "Ctrl+D", "Ctrl+C", "Ctrl+L"]', 'Ctrl+J', 'Ctrl+J duplicates the current layer or selection to a new layer.', 'easy', 10),
  ('Which color mode is best for print projects?', '["RGB", "CMYK", "LAB", "Grayscale"]', 'CMYK', 'CMYK is the standard color mode for print production.', 'easy', 10),
  ('What tool is used to remove unwanted objects from an image?', '["Clone Stamp", "Brush", "Eraser", "Pen"]', 'Clone Stamp', 'The Clone Stamp tool copies pixels from one area to cover another.', 'medium', 15),
  ('What is a layer mask used for?', '["Non-destructive editing", "Adding text", "Color correction", "Resizing images"]', 'Non-destructive editing', 'Layer masks hide or reveal parts of a layer without permanently deleting pixels.', 'medium', 15),
  ('Which file format supports transparency?', '["JPEG", "PNG", "BMP", "TIFF"]', 'PNG', 'PNG supports alpha channel transparency for web graphics.', 'easy', 10),
  ('What does the Healing Brush tool do?', '["Repairs imperfections", "Paints color", "Erases pixels", "Creates shapes"]', 'Repairs imperfections', 'The Healing Brush samples texture and blends it to repair blemishes.', 'medium', 15),
  ('What is resolution measured in for print?', '["DPI", "FPS", "Megapixels", "Bits"]', 'DPI', 'DPI (dots per inch) measures print resolution. 300 DPI is standard for print.', 'easy', 10),
  ('Which blending mode multiplies colors for a darker result?', '["Multiply", "Screen", "Overlay", "Normal"]', 'Multiply', 'Multiply blending mode darkens by multiplying base and blend colors.', 'medium', 15),
  ('What is the purpose of Smart Objects?', '["Preserve source content", "Speed up editing", "Add filters", "Create animations"]', 'Preserve source content', 'Smart Objects preserve source content, enabling non-destructive scaling and filtering.', 'medium', 15),
  ('Which tool creates precise paths and selections?', '["Pen Tool", "Lasso Tool", "Magic Wand", "Quick Selection"]', 'Pen Tool', 'The Pen Tool creates precise vector paths that can be converted to selections.', 'medium', 15)
) AS q(question_text, options, correct_answer, explanation, difficulty, points)
WHERE e.slug = 'adobe-photoshop';

-- Insert badges
INSERT INTO public.badges (name, description, icon, rarity, condition_type, condition_value) VALUES
  ('First Steps', 'Complete your first practice quiz', 'footprints', 'common', 'quiz_complete', 1),
  ('Quick Learner', 'Earn 100 XP', 'zap', 'common', 'xp', 100),
  ('Dedicated Student', 'Earn 500 XP', 'book-open', 'common', 'xp', 500),
  ('Knowledge Seeker', 'Earn 1000 XP', 'search', 'rare', 'xp', 1000),
  ('XP Master', 'Earn 5000 XP', 'crown', 'epic', 'xp', 5000),
  ('Legend', 'Earn 10000 XP', 'trophy', 'legendary', 'xp', 10000),
  ('Perfect Score', 'Get 100% on any quiz', 'star', 'rare', 'perfect_score', 1),
  ('Streak Starter', 'Maintain a 3-day streak', 'flame', 'common', 'streak', 3),
  ('Week Warrior', 'Maintain a 7-day streak', 'flame', 'rare', 'streak', 7),
  ('Month Master', 'Maintain a 30-day streak', 'flame', 'epic', 'streak', 30),
  ('Excel Expert', 'Pass the Excel certification', 'file-spreadsheet', 'rare', 'exam_pass', 1),
  ('Word Wizard', 'Pass the Word certification', 'file-text', 'rare', 'exam_pass', 1),
  ('Adobe Artist', 'Pass any Adobe certification', 'palette', 'rare', 'exam_pass', 1),
  ('Speed Demon', 'Complete a quiz in under 5 minutes', 'clock', 'rare', 'speed', 300)
ON CONFLICT DO NOTHING;

-- Insert daily missions
INSERT INTO public.missions (name, description, xp_reward, mission_type, target_value, is_daily) VALUES
  ('Daily Practice', 'Answer 10 questions today', 50, 'questions', 10, true),
  ('Perfect Run', 'Get 5 questions correct in a row', 75, 'streak', 5, true),
  ('Time Challenge', 'Spend 15 minutes practicing', 60, 'time', 15, true),
  ('Quiz Master', 'Complete 2 practice quizzes', 100, 'quizzes', 2, true),
  ('High Achiever', 'Score 80% or higher on a quiz', 80, 'score', 80, true)
ON CONFLICT DO NOTHING;
