import { renderWithProviders, screen, userEvent } from '../setup/test-utils'

// Example simple component to test setup
function Button({
  onClick,
  children
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  )
}

describe('Button Component (Setup Test)', () => {
  it('should render button with text', () => {
    renderWithProviders(<Button onClick={() => {}}>Click me</Button>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    renderWithProviders(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByText('Click me')
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
