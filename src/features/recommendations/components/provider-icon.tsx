import { Icon } from '@iconify/react'
import { CloudProvider } from "../../../types/recommendations"

interface ProviderIconProps {
    provider: CloudProvider
    className?: string
}

export function ProviderIcon({ provider, className = "h-5 w-5" }: ProviderIconProps) {
    const getIconName = () => {
        switch (provider) {
            case CloudProvider.AWS:
                return "mdi:aws";

            case CloudProvider.AZURE:
                return "lineicons:azure";

            case CloudProvider.UNSPECIFIED:

            default:
                return "bxl:google-cloud";

        }
    }

    return (
        <div className="text-muted-foreground">
            <Icon
                icon={getIconName()}
                className={className}
            />
        </div>
    )
}
