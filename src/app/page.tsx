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
import { Grid3x2, Search } from "lucide-react";

export default function Home() {
  const types = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];
  return (
    <div className="wrapper">
      <nav>
        <ul className="w-fit grid grid-cols1 ml-auto mr-auto gap-8 sm:grid-cols-2">
          <li className="w-fit">
            <NavLink href={"/pokemon"}>
              <Card className="w-80 py-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1">
                    <Grid3x2 size={32} className="text-secondary-500" />
                    ポケモン一覧
                  </CardTitle>
                  <CardDescription>
                    ポケモンを番号順に一覧で表示します。
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-gray-200 font-bold text-3xl h-1">
                  LIST
                </CardFooter>
              </Card>
            </NavLink>
          </li>
          <li className="w-fit">
            <NavLink href={"/pokemon"}>
              <Card className="w-80 py-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-1">
                    <Search size={32} className="text-secondary-500" />
                    ポケモン検索
                  </CardTitle>
                  <CardDescription>
                    ポケモンを名前で検索します。
                  </CardDescription>
                </CardHeader>
                <CardFooter className="text-gray-200 font-bold text-3xl h-1">
                  SEARCH
                </CardFooter>
              </Card>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
