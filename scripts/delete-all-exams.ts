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

async function deleteAllExams() {
  console.log('Deleting all existing exams and questions...')
  
  // First delete all question responses (due to FK constraints)
  const { error: responsesError } = await supabase
    .from('question_responses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (responsesError) {
    console.error('Error deleting question responses:', responsesError.message)
  } else {
    console.log('✓ All question responses deleted')
  }
  
  // Delete all quiz attempts
  const { error: attemptsError } = await supabase
    .from('quiz_attempts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (attemptsError) {
    console.error('Error deleting quiz attempts:', attemptsError.message)
  } else {
    console.log('✓ All quiz attempts deleted')
  }
  
  // Delete all questions
  const { error: questionsError } = await supabase
    .from('questions')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (questionsError) {
    console.error('Error deleting questions:', questionsError.message)
  } else {
    console.log('✓ All questions deleted')
  }
  
  // Then delete all exams
  const { error: examsError } = await supabase
    .from('exams')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  
  if (examsError) {
    console.error('Error deleting exams:', examsError.message)
  } else {
    console.log('✓ All exams deleted')
  }
  
  console.log('\n✅ Cleanup complete!')
  console.log('\nNext steps:')
  console.log('  1. Run the seed script: npx tsx scripts/seed-new-exams.ts')
}

deleteAllExams().catch(console.error)
