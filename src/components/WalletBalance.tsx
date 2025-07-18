import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useWallet } from '@/hooks/useWallet'
import { LogOut, Wallet } from 'lucide-react'

export function WalletBalance() {
  const { 
    address, 
    balance, 
    isBalanceLoading, 
    isBalanceError, 
    disconnectWallet 
  } = useWallet()

  if (!address) {
    return null
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Баланс кошелька
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Отключить
          </Button>
        </CardTitle>
        <CardDescription>
          Адрес: {address.slice(0, 6)}...{address.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {isBalanceLoading ? (
            <div className="text-muted-foreground">Загрузка...</div>
          ) : isBalanceError ? (
            <div className="text-destructive">Ошибка загрузки баланса</div>
          ) : (
            <div className="text-2xl font-bold">
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
