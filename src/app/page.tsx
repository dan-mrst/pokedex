import Image from "next/image";
import NavLink from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div>
      <nav>
        <ul className="flex justify-center gap-8">
          <li>
            <NavLink href={"/pokemon"}>
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>ポケモン一覧</CardTitle>
                  <CardDescription>
                    ポケモンを番号順に一覧で表示します。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={"https://placehold.jp/240x240.png"}
                    width={240}
                    height={240}
                    className="ml-auto mr-auto"
                  />
                </CardContent>
                <CardFooter>LIST</CardFooter>
              </Card>
            </NavLink>
          </li>
          <li>
            <NavLink href={"/pokemon"}>
              <Card className="w-80">
                <CardHeader>
                  <CardTitle>ポケモン検索</CardTitle>
                  <CardDescription>
                    ポケモンを名前で検索します。
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    src={"https://placehold.jp/240x240.png"}
                    width={240}
                    height={240}
                    className="ml-auto mr-auto"
                  />
                </CardContent>
                <CardFooter>SEARCH</CardFooter>
              </Card>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
