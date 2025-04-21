
export type CategoryType = {
    id: number,
    name: string,
    translation: string,
    largeImage: string,
    smallImage: string,
    url: string,
    isAvailable: boolean,
    lineImage: string,
}

export type SubCategoryType = {
    id: number,
    mainCategory: string,
    subCategories: CategoryType[]
}

export type MemberInfoData = {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    image: string;
    specialized: string[];
    reviews_data: MemberReviews[];
    total_reviews: number;
    avg_star_count: number;
}

export type MemberReviews = {
    reviewed_consumer_id: number;
    reviewed_name: string;
    reviewed_star_count: number;
    reviewed_consumer_img_url: string;
    reviewed_consumer_content: string;
    reviewed_consumer_content_imgs: string[];
    reviewed_date: string;
}