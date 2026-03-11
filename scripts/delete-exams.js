const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const keepExams = ['databases', 'python', 'networking']

async function deleteExams() {
  // First get all exams
  const { data: exams, error: fetchError } = await supabase
    .from('exams')
    .select('id, name')
  
  if (fetchError) {
    console.error('Error fetching exams:', fetchError)
    return
  }
  
  console.log(`Found ${exams.length} exams:`)
  exams.forEach(e => console.log(`  - ${e.name}`))
  
  // Find exams to delete (not in keep list)
  const toDelete = exams.filter(e => {
    const name = e.name.toLowerCase()
    return !keepExams.some(keep => name.includes(keep))
  })
  
  if (toDelete.length === 0) {
    console.log('\nNo exams to delete. All exams match the keep list.')
    return
  }
  
  console.log(`\nDeleting ${toDelete.length} exams:`)
  toDelete.forEach(e => console.log(`  - ${e.name}`))
  
  // Delete each exam (this will cascade delete related questions due to FK constraints)
  for (const exam of toDelete) {
    const { error } = await supabase
      .from('exams')
      .delete()
      .eq('id', exam.id)
    
    if (error) {
      console.error(`Failed to delete "${exam.name}":`, error.message)
    } else {
      console.log(`✓ Deleted "${exam.name}"`)
    }
  }
  
  console.log('\nDone!')
}

deleteExams().catch(console.error)
