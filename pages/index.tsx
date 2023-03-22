import {NextPage, GetServerSideProps} from "next";
import { useState } from "react";

type Image = {
  url: string;
}

type Props = {
  initialImageUrl: string;
}

const IndexPage: NextPage<Props> = ({initialImageUrl}) => {
  //useStateで状態管理
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [loading, setLoading] = useState(true);
  // //マウント時に読み込む
  // useEffect(() => {
  //   fetchImage().then((newImage) => {
  //     setImageUrl(newImage.url)//画像URLを更新
  //     setLoading(false);//loadingを更新
  //   })
  // }, []);



  //ボタンをclickした時に画像を読み込む
  const handleClick = async() => {
    setLoading(true);
    const newImage = await fetchImage();
    setImageUrl(newImage.url);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleClick}>その他のニャンコを見る</button>
      <div>{loading || <img src={imageUrl}/>}</div>
    </div>
  );
}

const fetchImage = async(): Promise<Image> => {
  const res = await fetch("https://api.thecatapi.com/v1/images/search");
  const images = await res.json();
  //配列として表現されているか
  if (!Array.isArray(images)) {
    throw new Error("猫画像を取得できませんでした。");
  }

  const image: unknown = images[0];

  if (!isImage(image)) {
    throw new Error("猫画像を取得できませんでした。");
  }
  return image;
};

//型ガード関数
const isImage = (value: unknown): value is Image => {
  //値がObjectか？
  if (!value || typeof value !== "object") {
    return false;
  }
  //urlプロパティが存在するか かつ それが文字列か？
  return "url" in value && typeof value.url == "string";
};


//サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async() => {
  const image = await fetchImage();
  return {
    props: {
      initialImageUrl: image.url,
    },
  };
};

export default IndexPage;
