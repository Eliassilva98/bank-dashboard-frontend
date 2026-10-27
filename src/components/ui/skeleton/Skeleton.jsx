import { Skeleton as StyledSkeleton } from './styles'

const Skeleton = ({
  width,
  height,
  circle = false,
  count = 1
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <StyledSkeleton
          key={index}
          $width={width}
          $height={height}
          $circle={circle}
        />
      ))}
    </>
  )
}

export default Skeleton