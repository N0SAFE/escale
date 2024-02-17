'use client'

export function Test ({ clearSession }: { clearSession: () => void }) {
    
    
    return (
      <button onClick={() => clearSession()}>clear session</button>
    )
  }