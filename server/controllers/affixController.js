const Affix = require("../models/affixModel");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
	try {
		let query = Affix.find();
		query = query.select("roman meaning korean");

		let affixes = await query;

		res.send({
			result: affixes.length,
			affixes,
		});
	} catch (err) {
		console.log(err);
	}
});

exports.getOne = catchAsync(async (req, res) => {
	Affix.findOne({ roman: req.params.id })
		.then((response) => {
			res.send(response);
		})
		.catch((error) => {
			console.log(error);
			res.status(500).json("Что-то пошло не по плану...");
		});
});

exports.createAffix = catchAsync(async (req, res) => {
	const { korean, roman, meaning, description } = req.body;

	const duplicateFields = [];

	// попытка найти в базе аффикс с такими же полями korean и roman - дубликаты
	let query = Affix.find();
	query = query.or([{ korean }, { roman }]);

	// фильтр только необходимых полей
	query.projection("roman korean");

	const result = await query;

	if (result.some((e) => e.roman === roman)) {
		duplicateFields.push("roman_taken");
	}

	if (result.some((e) => e.korean === korean)) {
		duplicateFields.push("korean_taken");
	}

	// если хоть одно из полей дублируется - ошибка 400
	if (duplicateFields.length) {
		return res.status(400).json(duplicateFields);
	}

	await Affix.create({
		roman,
		korean,
		meaning,
		description,
	});

	res.status(201).json("success");
});
