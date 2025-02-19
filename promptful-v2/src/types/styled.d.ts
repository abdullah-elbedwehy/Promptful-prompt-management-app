import 'styled-components';
import { ThemeConfig } from './index';

declare module 'styled-components' {
    export interface DefaultTheme extends ThemeConfig {}
}