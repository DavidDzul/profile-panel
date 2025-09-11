declare interface AttendanceStatus {
  status: 'PRESENT' | 'ABSENT' | 'JUSTIFIED'
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
