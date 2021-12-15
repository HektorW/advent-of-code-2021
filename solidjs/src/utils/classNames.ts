export default function classNames(...classNames: any[]): string {
  return classNames
    .filter((className): className is string => typeof className === 'string')
    .join(' ')
}
