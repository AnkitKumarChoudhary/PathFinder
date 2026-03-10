export default function TakeAssessmentPage({
    params,
}: {
    params: { id: string };
}) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-2xl font-bold">Assessment #{params.id} — Coming Soon</h1>
        </div>
    );
}
