import sbt._

object AppDependencies {

  val compile = Seq(
    "uk.gov.hmrc"             %% "bootstrap-frontend-play-30" % "10.7.0",
    "uk.gov.hmrc"             %% "play-frontend-hmrc-play-30" % "13.9.0"
  )

  val test = Seq(
    "uk.gov.hmrc"             %% "bootstrap-test-play-30"     % "10.7.0"             % Test
  )

  val all: Seq[ModuleID] = compile ++ test
}
