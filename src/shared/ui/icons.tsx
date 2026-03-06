export function IconsShared() {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: Symbols are used elsewhere where titles are provided
    <svg style={{ display: 'none' }}>
      <symbol id='line-md-close' viewBox='0 0 24 24'>
        <path
          d='M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7'
          fill='none'
          stroke='currentColor'
          strokeDasharray='12'
          strokeDashoffset='12'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='2'
        >
          <animate attributeName='stroke-dashoffset' dur='0.3s' fill='freeze' values='12;0'></animate>
        </path>
      </symbol>
      <symbol id='line-md-search' viewBox='0 0 24 24'>
        <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
          <path
            d='M10.76 13.24c-2.34 -2.34 -2.34 -6.14 0 -8.49c2.34 -2.34 6.14 -2.34 8.49 0c2.34 2.34 2.34 6.14 0 8.49c-2.34 2.34 -6.14 2.34 -8.49 0Z'
            strokeDasharray='40'
            strokeDashoffset='40'
          >
            <animate attributeName='stroke-dashoffset' dur='0.5s' fill='freeze' values='40;0'></animate>
          </path>
          <path d='M10.5 13.5l-7.5 7.5' strokeDasharray='12' strokeDashoffset='12'>
            <animate attributeName='stroke-dashoffset' begin='0.5s' dur='0.2s' fill='freeze' values='12;0'></animate>
          </path>
        </g>
      </symbol>
      <symbol id='line-md-loading-loop' viewBox='0 0 24 24'>
        <path d='M12 3c4.97 0 9 4.03 9 9' fill='none' stroke='currentColor' strokeDasharray='16' strokeDashoffset='16' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
          <animate attributeName='stroke-dashoffset' dur='0.2s' fill='freeze' values='16;0'></animate>
          <animateTransform attributeName='transform' dur='1.5s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'></animateTransform>
        </path>
      </symbol>
    </svg>
  )
}
