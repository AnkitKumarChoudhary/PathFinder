export function formatSalary(salary: string | Record<string, number> | null): string {
  if (!salary) return 'Varies'

  try {
    const parsed = typeof salary === 'string' ? JSON.parse(salary) : salary

    if (typeof parsed === 'string') return parsed

    if (parsed && typeof parsed === 'object') {
      const salaryObj = parsed as Record<string, number>
      const entry = salaryObj.entry || salaryObj.min || 0
      const senior = salaryObj.senior || salaryObj.max || 0

      const entryLPA = entry / 100000
      const seniorLPA = senior / 100000

      const formatNum = (n: number): string => {
        if (n >= 100) return `${(n / 100).toFixed(0)} Cr`
        if (n >= 10) return `${n.toFixed(0)} LPA`
        if (n > 0) return `${n.toFixed(1)} LPA`
        return ''
      }

      if (entry && senior) {
        return `₹${formatNum(entryLPA)} – ₹${formatNum(seniorLPA)}`
      }
      if (salaryObj.mid) {
        const midLPA = salaryObj.mid / 100000
        return `₹${formatNum(midLPA)} (avg)`
      }
      if (entry) return `From ₹${formatNum(entryLPA)}`
      if (senior) return `Up to ₹${formatNum(seniorLPA)}`
    }
  } catch {
    if (typeof salary === 'string') return salary
  }

  return 'Varies'
}