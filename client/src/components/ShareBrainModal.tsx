import { useState } from "react"

interface ShareBrainModalProps {
    brainId: string
    brainTitle: string
    onClose: () => void
}

function ShareBrainModal({ brainId, brainTitle, onClose }: ShareBrainModalProps) {
    const [copied, setCopied] = useState(false)

    const shareUrl = `${window.location.origin}/public/brain/${brainId}`

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-800 p-6 rounded-xl w-[500px] text-white" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span>🔗</span>
                    Share "{brainTitle}"
                </h2>

                <p className="text-slate-300 text-sm mb-4">
                    Anyone with this link can view this brain and its content
                </p>

                <div className="flex gap-2 mb-4">
                    <input
                        readOnly
                        value={shareUrl}
                        className="flex-1 p-2 rounded bg-slate-700 text-slate-200 text-sm"
                        onClick={(e) => e.currentTarget.select()}
                    />
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded font-medium transition-colors ${copied
                                ? "bg-green-600 hover:bg-green-500"
                                : "bg-indigo-600 hover:bg-indigo-500"
                            }`}
                    >
                        {copied ? "✓ Copied!" : "Copy"}
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-slate-600 px-4 py-2 rounded hover:bg-slate-500 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ShareBrainModal
