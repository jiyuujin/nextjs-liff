import { loadEnvConfig } from '@next/env'

export default async (): Promise<void> => {
  loadEnvConfig(process.env.PWD || process.cwd())
}
