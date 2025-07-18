import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { History } from 'lucide-react'

export function TransactionHistory() {
  const { address } = useWallet()

  if (!address) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-6 w-6" />
          История транзакций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-8">
          <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Функция просмотра истории транзакций</p>
          <p className="text-sm">будет добавлена в следующих версиях</p>
        </div>
      </CardContent>
    </Card>
  )
}
