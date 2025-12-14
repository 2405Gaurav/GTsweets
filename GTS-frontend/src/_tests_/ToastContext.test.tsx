// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import { describe, it, expect } from 'vitest'
// import { ToastProvider, useToast } from '../ToastContext'

// const TestComponent = () => {
//   const { showToast } = useToast()

//   return (
//     <button onClick={() => showToast('Hello Toast', 'success')}>
//       Show Toast
//     </button>
//   )
// }

// describe('ToastContext', () => {
//   it('renders toast when showToast is called', async () => {
//     render(
//       <ToastProvider>
//         <TestComponent />
//       </ToastProvider>
//     )

//     await userEvent.click(screen.getByText('Show Toast'))

//     expect(screen.getByText('Hello Toast')).toBeInTheDocument()
//   })

//   it('removes toast when close button is clicked', async () => {
//     render(
//       <ToastProvider>
//         <TestComponent />
//       </ToastProvider>
//     )

//     await userEvent.click(screen.getByText('Show Toast'))

//     const closeBtn = screen.getByRole('button', { name: '×' })
//     await userEvent.click(closeBtn)

//     expect(screen.queryByText('Hello Toast')).not.toBeInTheDocument()
//   })
// })
