import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { textStyles } from "./text-styles";

const config = defineConfig({
    theme: {
        textStyles,
        tokens: {
            colors: {
                'flash7': {
                    value: '#94A89A'
                }
            }
        }
    }
})

export default createSystem(defaultConfig, config)