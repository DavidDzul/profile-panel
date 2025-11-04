declare interface AttendanceStatus {
  status: 'PRESENT' | 'ABSENT' | 'LATE'
  class_status: 'IN_PROCESS' | 'COMPLETED'
  check_in: string | null
  check_out: string | null
  can_checkin: boolean
  can_checkout: boolean
  is_completed: boolean
  class: {
    id: number
    name: string
    date: string
    start_time: string
    end_time: string
    created_at: string
    updated_at: string
  }
}

declare interface Attendance {
  id: number
  user_id: number
  class_id: number
  check_in: number
  check_out: string | null
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED_LATE' | 'LATE' | 'JUSTIFIED_ABSENCE'
  class_status: 'IN_PROCESS' | 'COMPLETED'
  observations: string | null
  class: Class
}
