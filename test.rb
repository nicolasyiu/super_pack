class RN
  jp_str = "あ ア 歲 い イ i う ウ 18 え エ 性 お オ 愛

か カ 寞 き キ 寂 く ク 熱 け ケ 看 こ コ av 學 心 涩

さ サ 林 し シ 動 す 交 ス 水 京 せ 力 セ 女 そ ソ 少 淫 美 初

た タ 空 ち チ chi つ ツ 日 て ° 度 夜 テ 漢 影 と ト 儿 愛 16

な ナ 倉 に 雨 ニ 性 ぬ 電 ヌ 本 ね 濕 ネ  の ノ 図 師 卯 20

は ハ 爱 ひ ヒ 胸 澤 夫 ふ フ 国 へ 友 ヘ 妹 愛 爱 艾 ほ ホ 人 啦 妻

ま マ 龍 み ミ 島 む ム 天 影 め メ O 乳 も モ 成 人 情

や ヤ の ゆ ユ yu よ ヨ 播 情 銫 愛 O X X 力 娜

ら ラ 城 り リ ri る ル ru れ レ 仁 ろ ロ 仆 试

わ ワ 野 を ヲ 郎 生 口

ん ン n 美 女 直 播 秀 小 電 影 空 色 愛 情 羞 銫 君 と 二 人 で "
  ARRAY = jp_str.split(" ")

  def random_name
    puts (1..(2+rand(4))).to_a.inject('') { |sum, i| sum+=ARRAY[rand(ARRAY.length)] }
  end

end

rm = RN.new
100.times.each { rm.random_name }
