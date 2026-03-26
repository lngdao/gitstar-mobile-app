import { ConfigPlugin, withDangerousMod, AndroidConfig } from 'expo/config-plugins';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Plugin to add Android resource keep rules
 *
 * This prevents the Android resource shrinker from removing app icons and splash screens
 * when building release APKs with minification enabled.
 *
 * The plugin creates a keep.xml file in res/raw/ that tells the build tools
 * which resources must be kept even if they appear unused.
 *
 * @see https://developer.android.com/build/shrink-code#keep-resources
 */
const withAndroidIconKeepRules: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const resRawPath = path.join(
        projectRoot,
        'android',
        'app',
        'src',
        'main',
        'res',
        'raw'
      );

      // Ensure the raw directory exists
      if (!fs.existsSync(resRawPath)) {
        fs.mkdirSync(resRawPath, { recursive: true });
      }

      // Create keep.xml content
      const keepXmlContent = `<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:keep="@mipmap/ic_launcher,@mipmap/ic_launcher_round,@mipmap/ic_launcher_foreground,@drawable/splashscreen_logo,@drawable/ic_launcher_background"
    tools:shrinkMode="strict" />
`;

      // Write keep.xml file
      const keepXmlPath = path.join(resRawPath, 'keep.xml');
      fs.writeFileSync(keepXmlPath, keepXmlContent, 'utf-8');

      console.log('✅ Added Android resource keep rules to prevent icon removal during resource shrinking');

      return config;
    },
  ]);
};

export default withAndroidIconKeepRules;
