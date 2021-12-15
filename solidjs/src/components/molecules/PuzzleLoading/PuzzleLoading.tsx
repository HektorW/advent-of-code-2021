import LoadingIndicator from '../../atoms/LoadingIndicator'

export interface PuzzleLoadingProps {
  partNumber: number
}

export default function PuzzleLoading(props: PuzzleLoadingProps) {
  return (
    <div>
      <LoadingIndicator />
      Calculating answer for part {props.partNumber}
    </div>
  )
}
