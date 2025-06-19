import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
export default defineConfig({
  html: {
    title: 'F7',
  },
  plugins: [
    pluginReact(),
    process.env.RSDOCTOR ? new RsdoctorRspackPlugin({}) as any : undefined,
  ].filter(Boolean),
});
