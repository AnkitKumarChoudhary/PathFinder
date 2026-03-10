export default function ChildDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Child #{params.id} Progress — Coming Soon</h1>
        </div>
    );
}
