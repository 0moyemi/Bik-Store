import ProductDetails from "."

interface PageProps {
  searchParams: Promise<{ id: string }>
}

const page = async ({ searchParams }: PageProps) => {
  const { id } = await searchParams

  if (!id) {
    return <div className="p-8 text-center">Product ID is required</div>
  }

  return <ProductDetails productId={id} />
}

export default page