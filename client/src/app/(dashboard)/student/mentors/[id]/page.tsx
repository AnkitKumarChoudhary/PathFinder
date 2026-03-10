export default function MentorDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Mentor Profile #{params.id} — Coming Soon</h1>
        </div>
    );
}
