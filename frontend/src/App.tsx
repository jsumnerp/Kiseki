
import './App.css'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card'

function App() {

  return (
    <Card className="w-full max-w-sm gap-1">
      <CardTitle>Company Name</CardTitle>
      <CardDescription>Senior Software Engineer</CardDescription>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <p>Footer content here.</p>
      </CardFooter>      
    </Card>
  )
}

export default App
