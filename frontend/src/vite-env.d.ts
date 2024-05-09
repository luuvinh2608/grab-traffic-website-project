/// <reference types="vite/client" />
/// <reference types="redux-persist" />
interface ImportMetaEnv {
  readonly VITE_MAPBOX_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}