import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface Exam {
  id: string
  name: string
}

const keepExams = ['databases', 'python', 'networking']

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get all exams
    const { data: exams, error: fetchError } = await supabase
      .from('exams')
      .select('id, name')
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    // Find exams to delete
    const toDelete = exams?.filter((e: Exam) => {
      const name = e.name.toLowerCase()
      return !keepExams.some(keep => name.includes(keep))
    }) || []
    
    const remaining = exams?.filter((e: Exam) => 
      keepExams.some(keep => e.name.toLowerCase().includes(keep))
    ) || []
    
    return NextResponse.json({
      totalExams: exams?.length || 0,
      willDelete: toDelete.map(e => e.name),
      willKeep: remaining.map(e => e.name),
      message: `Found ${toDelete.length} exams to delete. Use POST to actually delete them.`
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const supabase = await createClient()
    
    // Get all exams
    const { data: exams, error: fetchError } = await supabase
      .from('exams')
      .select('id, name')
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }
    
    // Find exams to delete (not in keep list - case insensitive, partial match)
    const toDelete = exams?.filter((e: Exam) => {
      const name = e.name.toLowerCase()
      return !keepExams.some(keep => name.includes(keep))
    }) || []
    
    if (toDelete.length === 0) {
      return NextResponse.json({ 
        message: 'No exams to delete. All exams match the keep list.',
        exams: exams?.map(e => e.name)
      })
    }
    
    // Delete each exam
    const deleted: string[] = []
    const failed: string[] = []
    
    for (const exam of toDelete as Exam[]) {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', exam.id)
      
      if (error) {
        failed.push(`${exam.name}: ${error.message}`)
      } else {
        deleted.push(exam.name)
      }
    }
    
    return NextResponse.json({
      deleted,
      failed,
      remaining: exams?.filter((e: Exam) => 
        keepExams.some(keep => e.name.toLowerCase().includes(keep))
      ).map(e => e.name)
    })
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete exams' },
      { status: 500 }
    )
  }
}
