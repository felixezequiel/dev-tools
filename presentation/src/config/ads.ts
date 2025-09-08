export type AdProvider = 'dummy' | 'adsense' | 'gpt';

export type AdPlacement =
    | 'header_banner'
    | 'sidebar_sticky'
    | 'converter_inline'
    | 'converter_output_footer'
    | 'comparator_mid';

export interface AdPlacementConfig {
    enabled: boolean;
    /** Optional: hide on small screens (mobile) to reduce clutter */
    hideOnMobile?: boolean;
    /** Unique key to map provider ad unit for this placement */
    unitKey: string;
}

export interface AdsConfig {
    enabled: boolean;
    provider: AdProvider;
    placements: Record<AdPlacement, AdPlacementConfig>;
    adsense?: {
        clientId: string;
        slots: Record<AdPlacement, string>;
    };
}

export const adsConfig: AdsConfig = {
    enabled: true,
    provider: 'adsense',
    placements: {
        header_banner: { enabled: false, hideOnMobile: true, unitKey: 'header_banner' },
        sidebar_sticky: { enabled: true, hideOnMobile: true, unitKey: 'sidebar_sticky' },
        converter_inline: { enabled: true, hideOnMobile: false, unitKey: 'converter_inline' },
        converter_output_footer: { enabled: true, hideOnMobile: false, unitKey: 'converter_output_footer' },
        comparator_mid: { enabled: true, hideOnMobile: false, unitKey: 'comparator_mid' },
    },
    adsense: {
        clientId: 'ca-pub-4797377323566395',
        // TODO: substitua pelas IDs reais de cada unidade AdSense
        slots: {
            header_banner: '',
            sidebar_sticky: '',
            converter_inline: '',
            converter_output_footer: '',
            comparator_mid: '',
        },
    },
};

export function isAdEnabled(slot: AdPlacement): boolean {
    if (!adsConfig.enabled) return false;
    const cfg = adsConfig.placements[slot];
    if (!cfg || !cfg.enabled) return false;
    if (cfg.hideOnMobile && typeof window !== 'undefined') {
        const mq = window.matchMedia('(max-width: 767px)');
        if (mq.matches) return false;
    }
    return true;
}

export function getAdUnitKey(slot: AdPlacement): string {
    const cfg = adsConfig.placements[slot];
    return cfg?.unitKey ?? slot;
}


