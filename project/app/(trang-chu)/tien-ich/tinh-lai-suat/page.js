"use client"
import LoanCalculator from '@/components/general_page/project/LoanCalculator'
import React from 'react'

const page = () => {
  return (
    <div className='max-w-3xl mx-auto'>
      <div className='py-20'>
        <h1 className='text-2xl font-medium mb-10'>Công cụ tính lãi suất vay vốn</h1>
        <LoanCalculator />
      </div>
    </div>
  )
}

export default page