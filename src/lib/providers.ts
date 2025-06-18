import { CloudProvider } from "../types/recommendations"

export function getProviderName(provider: CloudProvider): string {
    switch (provider) {
        case CloudProvider.AWS:
            return "Amazon Web Services"
        case CloudProvider.AZURE:
            return "Microsoft Azure"
        case CloudProvider.UNSPECIFIED:
        default:
            return "Unspecified"
    }
}

export const providerColors = {
    [CloudProvider.AWS]: "text-orange-600",
    [CloudProvider.AZURE]: "text-blue-600",
    [CloudProvider.UNSPECIFIED]: "text-gray-600",
}
