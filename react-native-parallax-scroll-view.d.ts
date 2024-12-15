// react-native-parallax-scroll-view.d.ts

declare module 'react-native-parallax-scroll-view' {
   import { Component } from 'react'
   import { ScrollViewProps, ViewStyle } from 'react-native'

   export interface ParallaxScrollViewProps extends ScrollViewProps {
      backgroundColor?: string
      contentBackgroundColor?: string
      parallaxHeaderHeight?: number
      fixedHeaderHeight?: number
      stickyHeaderHeight?: number
      contentContainerStyle?: ViewStyle
      renderBackground?: () => JSX.Element
      renderForeground?: () => JSX.Element
      renderStickyHeader?: () => JSX.Element
      parallaxHeader?: () => JSX.Element
      renderStickyFixedHeader?: () => JSX.Element
      parallaxHeader?: () => JSX.Element
      renderFixedHeader?: () => JSX.Element
      stickyHeader?: () => JSX.Element
      // Add more props and types as needed
   }

   export default class ParallaxScrollView extends Component<ParallaxScrollViewProps> {}
}
