import { FiArrowDown, FiMinus, FiArrowUp } from 'react-icons/fi'
import { formatUsd } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import Skeleton from '@/components/ui/skeleton/Skeleton'
import { Strip, Indicator, IndicatorSkeleton, Name, Value, Meta, Variation } from './styles'

const trendIcons = {
  up: FiArrowUp,
  down: FiArrowDown,
  flat: FiMinus
}

const getTrend = (variation) => {
  if (variation > 0) return 'up'
  if (variation < 0) return 'down'
  return 'flat'
}

const MarketStrip = ({ market, isLoading, error }) => {
  if (isLoading) {
    return (
      <Strip>
        <IndicatorSkeleton>
          <Skeleton width='3rem' height='0.875rem' />
          <Skeleton width='6rem' height='1.5rem' />
          <Skeleton width='5rem' height='0.875rem' />
          <Skeleton width='10rem' height='0.875rem' />
        </IndicatorSkeleton>

        <IndicatorSkeleton>
          <Skeleton width='3rem' height='0.875rem' />
          <Skeleton width='5rem' height='1.5rem' />
          <Skeleton width='9rem' height='0.875rem' />
        </IndicatorSkeleton>

        <IndicatorSkeleton>
          <Skeleton width='2.5rem' height='0.875rem' />
          <Skeleton width='5rem' height='1.5rem' />
          <Skeleton width='9rem' height='0.875rem' />
        </IndicatorSkeleton>
      </Strip>
    )
  }

  if (error) return <Strip $isError>{error}</Strip>

  const { dolar, selic, cdi } = market ?? {}
  const variation = Number(dolar?.variationPct ?? 0)
  const trend = getTrend(variation)
  const TrendIcon = trendIcons[trend]
  const variationLabel = `${variation > 0 ? '+' : ''} ${variation.toFixed(2).replace('.', ',')}%`

  return (
    <Strip>
      <Indicator>
        <Name>Dólar</Name>
        {dolar ? (
          <>
            <Value>{formatUsd(dolar.value)}</Value>
            <Variation $trend={trend}>
              <TrendIcon size={14} aria-hidden='true' />
              <span>{variationLabel}</span>
            </Variation>
            <Meta>Atualizado {formatDate(dolar.updatedAt)}</Meta>
          </>
        ) : (
          <>
            <Value>Indisponível</Value>
            <Meta>Tente novamente mais tarde</Meta>
          </>
        )}
      </Indicator>

      <Indicator>
        <Name>Selic</Name>
        {selic ? (
          <>
            <Value>{`${selic.value}%`}</Value>
            <Meta>Referência {formatDate(selic.date)}</Meta>
          </>
        ) : (
          <>
            <Value>Indisponível</Value>
            <Meta>Tente novamente mais tarde</Meta>
          </>
        )}
      </Indicator>

      <Indicator>
        <Name>CDI</Name>
        {cdi ? (
          <>
            <Value>{`${cdi.value}%`}</Value>
            <Meta>Referência {formatDate(cdi.date)}</Meta>
          </>
        ) : (
          <>
            <Value>Indisponível</Value>
            <Meta>Tente novamente mais tarde</Meta>
          </>
        )}
      </Indicator>
    </Strip>
  )
}

export default MarketStrip