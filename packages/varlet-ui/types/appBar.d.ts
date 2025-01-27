import { VarComponent } from './varComponent'

interface AppBarProps {
  color?: string
  textColor?: string
  title?: string
  titlePosition?: 'left' | 'center' | 'right'
  elevation?: boolean
}

export class AppBar extends VarComponent {
  $props: AppBarProps
}
