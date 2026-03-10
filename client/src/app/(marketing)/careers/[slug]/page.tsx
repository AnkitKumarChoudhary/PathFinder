export default function CareerDetailPage({
    params,
}: {
    params: { slug: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Career Detail: {params.slug} — Coming Soon</h1>
        </div>
    );
}
