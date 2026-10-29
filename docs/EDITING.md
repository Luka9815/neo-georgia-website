# რედაქტორის გზამკვლევი

## შესვლა და შენახვა

1. გახსენით https://app.pagescms.org და შედით GitHub-ით. აირჩიეთ Luka9815/neo-georgia-website და main.
2. აირჩიეთ საჭირო კოლექცია, გახსენით ჩანაწერი ან დაამატეთ ახალი. გამოიყენეთ მხოლოდ ნამდვილი, დამტკიცებული ინფორმაცია.
3. slug ჩაწერეთ პატარა ლათინური ასოებით, ციფრებითა და ერთმაგი დეფისით. გამოქვეყნების შემდეგ აღარ შეცვალოთ.
4. შეავსეთ ქართული და ინგლისური ტექსტი. სიახლესა და ისტორიას შეიძლება მხოლოდ ქართული ვერსია ჰქონდეს; ინგლისური ნაწილი ან სრულად შეავსეთ, ან ცარიელი დატოვეთ.
5. შეინახეთ, დაელოდეთ წარმატებულ Deploy GitHub Pages პროცესს GitHub-ის Actions განყოფილებაში და გადაამოწმეთ ორივე ენა. ყოველდღიური განახლება იწყება 08:15-ზე თბილისის დროით; ხელით გაშვება შესაძლებელია Actions-ში Run workflow ღილაკით.

## კოლექციები

| კოლექცია | შესავსები ველები |
| --- | --- |
| სიახლეები (News) | გამოქვეყნების თარიღი YYYY-MM-DD, სათაური, ტექსტი, საჭიროებისამებრ მიმართულებები და სურათი |
| ღონისძიებები (Events) | დაწყება/დასრულება YYYY-MM-DDTHH:mm, Asia/Tbilisi ან Europe/Brussels, ტიპი, ფორმატი, ორგანიზატორი, მიმართულებები, ორივე ენის სათაური/ტექსტი/ადგილი; რეგისტრაცია და დღის წესრიგი სურვილისამებრ |
| კონკურსები (Calls) | მიმართულება, მთელი წელი, ბრიუსელის ადგილობრივი ვადა YYYY-MM-DDTHH:mm, ოფიციალური HTTPS ბმული, sourceChecked თარიღი, ორივე ენის სათაური/ტექსტი; გახსნის დრო მხოლოდ გადამოწმების შემდეგ |
| ხშირი კითხვები (FAQ) | თემა applications ან mobility, მიმართულებები, პასუხი ორივე ენაზე, წყაროს HTTPS ბმული და შემოწმების თარიღი |
| რესურსები (Resources) | წყარო official/neo/partner, ტიპი, ენა, წელი, მიმართულებები, სურვილისამებრ ღონისძიების slug, HTTPS ბმული, sourceChecked და ტექსტი ორივე ენაზე |
| პუბლიკაციები (Publications) | წელი, ტიპი, ენა, სათაური/ტექსტი ორივე ენაზე, sourceChecked; PDF ფაილი ან გარე HTTPS ბმული და გამომცემელი, ორივე ერთად არა |
| ისტორიები (Stories) | მიმართულება, წელი, სათაური და ტექსტი; ინგლისური სურვილისამებრ |

დროს არ დაუმატოთ Z ან UTC წანაცვლება. სისტემა დასახელებული დროის სარტყლით ითვლის ზაფხულის დროს. არარსებული ან ორჯერ განმეორებული ადგილობრივი დროის შემთხვევაში გადაამოწმეთ ორგანიზატორთან. ტექსტი ინახება Markdown-ად; HTML და ჩაშენებული სურათები არ გამოიყენოთ.

## პარამეტრები, გუნდი და HERE

1. პარამეტრები (Settings) ჯგუფში კონკურსის წელი ინახება Settings ფაილში, ოფისის ინფორმაცია კი Office details ფაილში. ეს ორი ფაილია, რადგან CMS-ის ერთი file ფორმა მხოლოდ ერთ გზას ინახავს.
2. Office details-ში შეავსეთ მისამართი და საათები ორივე ენაზე, საერთო ტელეფონი/ელფოსტა, ERIDA-ს კოდი და მისამართი, კონფიდენციალურობისა და ხელმისაწვდომობის კონტაქტები.
3. გუნდი (Team) ამავე ფორმის სექციაა: სამი როლის სახელი ორივე ენაზე და სამსახურებრივი ელფოსტა. ინგლისური სახელი უნდა ემთხვეოდეს ქართულ ეროვნულ ტრანსლიტერაციას.
4. HERE სექციაში მიუთითეთ პერიოდი და მხოლოდ დადასტურებული წევრები: სახელი და დაწესებულება ორივე ენაზე; ელფოსტა სურვილისამებრ. ცარიელი სია აჩვენებს ნეიტრალურ შეტყობინებას.
5. სოციალური ბმულები დაამატეთ მხოლოდ ნამდვილი HTTPS მისამართებითა და ორივე ენის წარწერით, ან დატოვეთ ცარიელი.
6. ტექნიკურმა პასუხისმგებელმა გაუშვას npm run report:tbc, სანამ docs/review/TBC.md-ში დარჩენილი მნიშვნელობების რაოდენობა ნულამდე შემცირდება. ფაქტები არ გამოიცნოთ.

siteLaunched არ შეცვალოთ. ის CMS-ში დამალული ტექნიკური გაშვების პარამეტრია. logoPath ცარიელი დატოვეთ, სანამ დამტკიცებული ლოგო არ იქნება. EU ემბლემა და განცხადებები არ შეცვალოთ.

## სურათები და შემოწმება

გამოიყენეთ მხოლოდ დამტკიცებული JPG, PNG, WebP ან AVIF. სურათს სჭირდება ქართული და ინგლისური მოკლე აღწერა, მაშინაც, როცა სიახლე მხოლოდ ქართულადაა. არ დატოვოთ [ALT NEEDED]. პუბლიკაციის ადგილობრივი ფაილი უნდა იყოს PDF /assets/publications საქაღალდეში. ფაილის სახელი იყოს მოკლე და ლათინური.

გამოქვეყნების შემდეგ შეამოწმეთ ჩანაწერი, სია, ბმულები, ენის გადართვა, სურათი და ალტერნატიული ტექსტი. შეცდომისას Actions-ის შეტყობინებაში ნახეთ ფაილი და ველი, გაასწორეთ და შეინახეთ ხელახლა. საჭიროებისას ლუკას გაუგზავნეთ შეცდომის ტექსტი და ჩანაწერის ბმული. პაროლი ან გასაღები არ გააგზავნოთ. წინა წარმატებული ვერსია ჩვეულებრივ რჩება ხელმისაწვდომი.

## 2027 წლის კონკურსების დამატება

1. თითოეული მიმართულებისთვის შექმენით ერთი Call, year=2027, უნიკალური slug-ით.
2. მიუთითეთ გადამოწმებული ბრიუსელის ვადა, ოფიციალური HTTPS ბმული და sourceChecked თარიღი. ვადები არ გამოიცნოთ.
3. შეავსეთ ორივე ენა და შეინახეთ ყველა ჩანაწერი. 2026 წლის კონკურსები დატოვეთ არქივში.
4. მხოლოდ ყველა 2027 ჩანაწერის შენახვის შემდეგ Settings-ში შეცვალეთ currentCallYear 2027-ზე.
5. წარმატებული გამოქვეყნების შემდეგ გადაამოწმეთ /ka/calls/ და /en/calls/, მიმდინარე წელი და არქივი.

# English staff guide

## Sign in, edit and verify

1. Sign in with GitHub at https://app.pagescms.org. Select Luka9815/neo-georgia-website and main.
2. Choose a collection, open an entry or add one. Use approved real information. Keep published slugs unchanged; use lowercase ASCII letters, digits and single hyphens.
3. Fill both languages. News and Stories may be Georgian only; supply complete English or omit it.
4. Save and wait for a successful Deploy GitHub Pages run in GitHub Actions. The daily rebuild starts at 08:15 Tbilisi time; Luka can also use Run workflow manually. Check the page and listing in both languages after deployment.

| Collection | What to enter |
| --- | --- |
| News | Publication date YYYY-MM-DD, title/body, optional Actions/image |
| Events | Start/end YYYY-MM-DDTHH:mm, named zone Asia/Tbilisi or Europe/Brussels, type, format, organiser, Actions, bilingual title/body/venue; optional registration/agenda |
| Calls | Action, integer year, Brussels deadline, official HTTPS URL, sourceChecked date and bilingual title/body; opening time only if verified |
| FAQ | Topic applications/mobility, Actions, bilingual question/answer, HTTPS source and sourceChecked |
| Resources | Source official/neo/partner, type, language, year, Actions, optional Event slug, HTTPS URL, sourceChecked and bilingual text |
| Publications | Year, type, language, sourceChecked, bilingual text; either a PDF in /assets/publications or an external HTTPS URL with publisher |
| Stories | Action, year, title/body; English optional |

Never append Z or an offset to wall-clock times. The build resolves the named time zone and rejects ambiguous/nonexistent times. Ask the organiser rather than guessing. Text is Markdown; do not insert HTML or inline images.

## Settings, Team and HERE

Open the Settings group. Its Settings file contains currentCallYear; Office details contains contact/legal facts, rights contacts, Team, HERE and social links. One CMS file form saves one path, so these remain two files within one group. Team means the section inside Office details, not a separate collection. Fill bilingual names with Georgian national transliteration and role emails. HERE members need bilingual name/institution, optional email and a period label; leave the list empty until confirmed. Social links need real HTTPS URLs and bilingual labels, or remain empty. Luka runs npm run report:tbc until the generated report reaches zero. Do not guess facts, change siteLaunched, alter EU artwork/disclaimers or add an unapproved logo.

## Images and deployment failures

Use approved JPG/PNG/WebP/AVIF files and meaningful Georgian and English alt text, including for Georgian-only News. Never leave [ALT NEEDED]. Publication uploads accept PDF only. After deployment check the page, listing, links, image, language switch and alt text. On failure, read the file/field in Actions, correct and save again. Send Luka the error and entry link if needed, never passwords or keys. The previous successful deployment normally remains available.

## Adding the 2027 calls

1. Add one Call per Action with year 2027 and a unique stable slug.
2. Enter the verified Brussels deadline, official HTTPS link and sourceChecked calendar date.
3. Fill both languages and save every record. Keep 2026 records as the archive.
4. Change currentCallYear to 2027 only after all 2027 records have been saved.
5. After successful deployment check /ka/calls/ and /en/calls/, including the archive.

Source check: 2026-10-29, [Pages CMS source 6f4e860](https://github.com/pagescms/pagescms/tree/6f4e860a35d934406580287e7042e5e111e207a1). Inspected lib/config-schema.ts (groups, single-file paths, readonly, hidden, lists, patterns, media), fields/core/number, file and rich-text, plus serialization and merge handling. Number widgets support bounds but do not enforce integer values; the build enforces integers. No hosted Event/image round trip or deployed-app revision is claimed.
