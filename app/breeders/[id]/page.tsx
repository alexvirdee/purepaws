const Breeder = ({ params }: { params: { id: string } }) => {
    const { id } = params;

    return (
        <div>
            Breeder Page: {id}
        </div>
    );
}
 
export default Breeder;