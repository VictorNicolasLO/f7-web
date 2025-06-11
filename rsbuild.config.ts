import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
export default defineConfig({
  plugins: [
    pluginReact(),
    process.env.RSDOCTOR ? new RsdoctorRspackPlugin({}) as any : undefined,
  ].filter(Boolean),
});
