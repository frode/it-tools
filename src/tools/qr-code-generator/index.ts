import { Qrcode } from '@vicons/tabler';
import type { ITool } from './../Tool';

export const tool: ITool = {
  name: 'QR Code generator',
  path: '/qrcode-generator',
  description:
    'Generate and download QR-code for an url or just a text and customize the background and foreground colors.',
  keywords: ['qr', 'code', 'generator', 'square', 'color', 'link', 'low', 'medium', 'quartile', 'high', 'transparent'],
  component: () => import('./qr-code-generator.vue'),
  icon: Qrcode,
};
